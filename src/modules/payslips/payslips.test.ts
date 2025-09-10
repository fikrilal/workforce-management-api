import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database';

const app = createServer();

async function registerAndLogin() {
  const email = `pay_${Date.now()}@example.com`;
  const password = 'password123';
  await request(app).post('/api/auth/register').send({ email, password, fullName: 'Pay Tester' }).expect(201);
  const login = await request(app).post('/api/auth/login').send({ email, password }).expect(200);
  return { token: login.body.data.accessToken as string };
}

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

describe('Payslips', () => {
  it('lists payslips with filters and gets by period', async () => {
    const { token } = await registerAndLogin();
    // insert two payslips for current and previous month
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(200);
    const userId = me.body.data.id as string;

    const now = new Date();
    const y = now.getUTCFullYear();
    const m = now.getUTCMonth() + 1;
    const prevM = m === 1 ? 12 : m - 1;
    const prevY = m === 1 ? y - 1 : y;

    await prisma.payslip.create({ data: { userId, year: y, month: m, currency: 'USD', gross: 1000 as any, net: 800 as any, items: { bonus: 100 } } as any });
    await prisma.payslip.create({ data: { userId, year: prevY, month: prevM, currency: 'USD', gross: 900 as any, net: 720 as any } as any });

    const list = await request(app)
      .get(`/api/payslips?year=${y}&page=1&pageSize=10`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(list.body.meta.total).toBeGreaterThanOrEqual(1);

    const get = await request(app)
      .get(`/api/payslips/${y}/${m}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(get.body.data.year).toBe(y);
    expect(get.body.data.month).toBe(m);
  });
});
