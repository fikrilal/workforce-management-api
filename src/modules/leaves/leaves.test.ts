import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database';

const app = createServer();

async function registerAndLogin() {
  const email = `leave_${Date.now()}@example.com`;
  const password = 'password123';
  await request(app).post('/api/auth/register').send({ email, password, fullName: 'Leave Tester' }).expect(201);
  const login = await request(app).post('/api/auth/login').send({ email, password }).expect(200);
  return { token: login.body.data.token as string };
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

describe('Leaves', () => {
  it('creates a leave, prevents overlap, lists with filters, and cancels pending', async () => {
    const { token } = await registerAndLogin();

    const create1 = await request(app)
      .post('/api/leaves')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'ANNUAL', startDate: '2025-09-10', endDate: '2025-09-12', reason: 'family' });
    expect(create1.status).toBe(201);
    const id = create1.body.data.id as string;

    const overlap = await request(app)
      .post('/api/leaves')
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'ANNUAL', startDate: '2025-09-11', endDate: '2025-09-11' });
    expect(overlap.status).toBe(409);
    expect(overlap.body.error.code).toBe('LEAVE_OVERLAP');

    const list = await request(app)
      .get('/api/leaves?month=2025-09&page=1&pageSize=10&type=ANNUAL&status=PENDING')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.meta).toMatchObject({ page: 1, pageSize: 10 });
    expect(list.body.meta.total).toBeGreaterThanOrEqual(1);

    const cancel = await request(app)
      .post(`/api/leaves/${id}/cancel`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(cancel.status).toBe(200);
    expect(cancel.body.data.status).toBe('CANCELLED');
  });
});
