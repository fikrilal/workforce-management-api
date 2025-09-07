# Deployment (Docker + GitHub Actions + DigitalOcean)

## Prereqs
- DigitalOcean droplet (Ubuntu 22.04+), SSH access.
- Docker + Compose on server:
```
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
```

## Server bootstrap (one time)
- Create app dir and .env:
```
sudo mkdir -p /srv/workforce-management-api && cd /srv/workforce-management-api
sudo tee .env >/dev/null <<'ENV'
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public
JWT_SECRET=change_me
ENV
sudo chown -R $USER:$USER /srv/workforce-management-api
```
- (Optional) Firewall: `sudo ufw allow 22 && sudo ufw allow 3000 && sudo ufw enable`
- First run will be performed by the CD workflow.

## GitHub secrets (Settings → Actions → New repository secret)
- SSH_HOST: droplet IP/hostname
- SSH_USER: SSH username
- SSH_KEY: private key (PEM content)
- SSH_PORT: 22 (or your port)
- APP_DIR: /srv/workforce-management-api
- GHCR_USERNAME: your GitHub username
- GHCR_TOKEN: GitHub PAT with read:packages scope

## CI/CD flow
- CI (.github/workflows/ci.yml): runs on PRs/branches → install, generate, lint, test, build.
- CD (.github/workflows/cd.yml): runs on main →
  - Build + push image to GHCR `ghcr.io/<owner>/<repo>:<sha>` and `:latest`
  - SSH to server → copy compose → `docker compose pull && up -d`
  - Apply DB migrations: `docker compose run --rm api npx prisma migrate deploy`

## Manual operations
- Pull latest image: `IMAGE=ghcr.io/<owner>/<repo>:latest docker compose -f docker-compose.prod.yml pull`
- Restart: `docker compose -f docker-compose.prod.yml up -d`
- Logs: `docker compose -f docker-compose.prod.yml logs -f`
- Migrate: `docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy`

## Notes
- Put Nginx/Certbot in front for TLS and request buffering (optional).
- Keep `DATABASE_URL` and `JWT_SECRET` only on the server `.env`.
- For rollbacks, deploy a previous image tag and `up -d` again.
