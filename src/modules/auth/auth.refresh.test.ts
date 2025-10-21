import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database';

const app = createServer();

beforeEach(async () => {
  await prisma.payslip.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth refresh/logout', () => {
  const baseUser = {
    email: `user_${Date.now()}@example.com`,
    password: 'password123',
    fullName: 'Jane Doe'
  };

  it('issues refresh cookie on register/login and rotates on refresh', async () => {
    const reg = await request(app).post('/api/auth/register').send(baseUser).expect(201);
    const sc = reg.headers['set-cookie'];
    const setCookie = Array.isArray(sc) ? sc : sc ? [sc] : [];
    expect(setCookie.join(';')).toMatch(/refresh_token=/);

    // refresh without cookie -> 401
    await request(app).post('/api/auth/refresh').expect(401);

    // refresh with cookie -> 200 and new cookie
    const refresh1 = await request(app).post('/api/auth/refresh').set('Cookie', setCookie).expect(200);
    const sc2 = refresh1.headers['set-cookie'];
    const setCookie2 = Array.isArray(sc2) ? sc2 : sc2 ? [sc2] : [];
    expect(setCookie2.join(';')).toMatch(/refresh_token=/);
    expect(refresh1.body.data.tokens.accessToken).toBeTruthy();
    expect(refresh1.body.data.tokens.refreshToken).toBeTruthy();

    // using old cookie again should fail due to rotation
    await request(app).post('/api/auth/refresh').set('Cookie', setCookie).expect(401);

    // logout revokes and clears cookie
    const logout = await request(app).post('/api/auth/logout').set('Cookie', setCookie2).expect(200);
    const sc3 = logout.headers['set-cookie'];
    const cleared = Array.isArray(sc3) ? sc3 : sc3 ? [sc3] : [];
    expect(cleared.join(';')).toMatch(/refresh_token=;/);

    // refreshing after logout should fail
    await request(app).post('/api/auth/refresh').set('Cookie', setCookie2).expect(401);
  });

  it('accepts refresh token in request body when cookie is missing', async () => {
    const reg = await request(app).post('/api/auth/register').send({
      ...baseUser,
      email: `body_${Date.now()}@example.com`
    }).expect(201);
    const refreshToken = reg.body.data.tokens.refreshToken;
    expect(typeof refreshToken).toBe('string');

    const refreshed = await request(app).post('/api/auth/refresh').send({ refreshToken }).expect(200);
    expect(refreshed.body.data.tokens.accessToken).toBeTruthy();
    expect(refreshed.body.data.tokens.refreshToken).toBeTruthy();

    await request(app).post('/api/auth/refresh').send({ refreshToken }).expect(401);
  });
});
