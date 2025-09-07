import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database';

const app = createServer();

beforeEach(async () => {
  await prisma.leaveRequest.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  const baseUser = {
    email: `user_${Date.now()}@example.com`,
    password: 'password123',
    fullName: 'John Doe'
  };

  it('registers a user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send(baseUser);
    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toMatchObject({ email: baseUser.email, fullName: baseUser.fullName });
  });

  it('prevents duplicate registrations for same email', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);
    const dup = await request(app).post('/api/auth/register').send(baseUser);
    expect(dup.status).toBe(409);
    expect(dup.body.error.code).toBe('EMAIL_TAKEN');
  });

  it('logs in with valid credentials', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);
    const res = await request(app).post('/api/auth/login').send({ email: baseUser.email, password: baseUser.password });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(baseUser.email);
  });

  it('rejects invalid login', async () => {
    await request(app).post('/api/auth/register').send(baseUser).expect(201);
    const res = await request(app).post('/api/auth/login').send({ email: baseUser.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('requires auth for /api/auth/me and returns current user', async () => {
    const reg = await request(app).post('/api/auth/register').send(baseUser).expect(201);
    const token = reg.body.data.token as string;

    const unauth = await request(app).get('/api/auth/me');
    expect(unauth.status).toBe(401);

    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.data.email).toBe(baseUser.email);
  });
});
