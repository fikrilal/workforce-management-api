import request from 'supertest';
import { createServer } from '../../infrastructure/http/server';
import { prisma } from '../../infrastructure/database';

const app = createServer();

beforeEach(async () => {
  await prisma.taskAttachmentLink.deleteMany();
  await prisma.taskEntry.deleteMany();
  await prisma.taskPlan.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

async function registerAndLogin() {
  const email = `task_user_${Date.now()}@example.com`;
  const password = 'password123';
  const register = await request(app)
    .post('/api/auth/register')
    .send({ email, password, fullName: 'Task Tester' })
    .expect(201);
  const token = register.body.data.tokens.accessToken;
  return { token };
}

describe('Tasks plans', () => {
  it('creates a plan for today and prevents duplicates', async () => {
    const { token } = await registerAndLogin();
    const payload = {
      summary: 'focus for today',
      tasks: [
        {
          title: 'Implement feature X',
          status: 'planned',
          attachments: [
            { url: 'https://example.com/doc', label: 'Spec' },
            { url: 'https://EXAMPLE.com/doc' }
          ]
        }
      ]
    };

    const createRes = await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(createRes.body.data.summary).toBe('focus for today');
    expect(createRes.body.data.tasks).toHaveLength(1);
    expect(createRes.body.data.tasks[0].attachments).toHaveLength(1);
    expect(createRes.body.data.tasks[0].status).toBe('PLANNED');

    await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(409);
  });

  it('updates today plan and blocks non-today updates', async () => {
    const { token } = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasks: [
          {
            title: 'Initial task',
            attachments: [{ url: 'https://example.com/a' }]
          }
        ]
      })
      .expect(201);

    const planId: string = createRes.body.data.id;

    const updateRes = await request(app)
      .patch(`/api/tasks/plans/${planId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: 'updated focus',
        tasks: [
          {
            title: 'Updated task',
            status: 'IN_PROGRESS',
            attachments: [{ url: 'https://example.com/b', label: 'issue' }]
          },
          {
            title: 'Another task',
            status: 'DONE',
            attachments: []
          }
        ]
      })
      .expect(200);

    expect(updateRes.body.data.summary).toBe('updated focus');
    expect(updateRes.body.data.tasks).toHaveLength(2);
    expect(updateRes.body.data.tasks[0].title).toBe('Updated task');
    expect(updateRes.body.data.tasks[1].status).toBe('DONE');

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const lockedDate = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));
    await prisma.taskPlan.update({
      where: { id: planId },
      data: { workDate: lockedDate }
    });

    await request(app)
      .patch(`/api/tasks/plans/${planId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: 'should fail',
        tasks: [
          {
            title: 'Attempted update',
            attachments: [{ url: 'https://example.com/c' }]
          }
        ]
      })
      .expect(409);
  });

  it('rejects attachments without https', async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasks: [
          {
            title: 'Task with bad link',
            attachments: [{ url: 'http://example.com/bad' }]
          }
        ]
      })
      .expect(422);
  });

  it('returns today plan or 404', async () => {
    const { token } = await registerAndLogin();
    await request(app)
      .get('/api/tasks/plans/today')
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    const createRes = await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        summary: 'today summary',
        tasks: [
          {
            title: 'First task',
            attachments: [{ url: 'https://example.com/today' }]
          }
        ]
      })
      .expect(201);

    const planId: string = createRes.body.data.id;

    const todayRes = await request(app)
      .get('/api/tasks/plans/today')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(todayRes.body.data.id).toBe(planId);
    expect(todayRes.body.data.tasks).toHaveLength(1);
  });

  it('lists history with filters and pagination', async () => {
    const { token } = await registerAndLogin();
    const createPlan = async (title: string) => {
      const res = await request(app)
        .post('/api/tasks/plans')
        .set('Authorization', `Bearer ${token}`)
        .send({
          tasks: [
            {
              title,
              attachments: [{ url: `https://example.com/${title}` }]
            }
          ]
        })
        .expect(201);
      return res.body.data.id as string;
    };

    const today = new Date();
    const day = (offset: number) =>
      new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + offset));

    const planOldId = await createPlan('old-task');
    await prisma.taskPlan.update({
      where: { id: planOldId },
      data: { workDate: day(-2) }
    });

    const planMidId = await createPlan('mid-task');
    await prisma.taskPlan.update({
      where: { id: planMidId },
      data: { workDate: day(-1) }
    });

    const planTodayId = await createPlan('today-task');

    const from = day(-3).toISOString();
    const to = day(0).toISOString();

    const historyRes = await request(app)
      .get('/api/tasks/history')
      .set('Authorization', `Bearer ${token}`)
      .query({ from, to, page: '1', pageSize: '10' })
      .expect(200);

    const items = historyRes.body.data as Array<{ id: string; tasks: Array<{ title: string }> }>;
    expect(items.map((item) => item.id)).toEqual([planTodayId, planMidId, planOldId]);
    expect(items[0].tasks[0].title).toBe('today-task');
    expect(historyRes.body.meta).toEqual({ total: 3, page: 1, pageSize: 10 });
  });

  it('updates a single task entry for today and blocks updates for past plans', async () => {
    const { token } = await registerAndLogin();
    const createRes = await request(app)
      .post('/api/tasks/plans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        tasks: [
          {
            title: 'Entry task one',
            attachments: [{ url: 'https://example.com/entry' }]
          }
        ]
      })
      .expect(201);

    const planId: string = createRes.body.data.id;
    const entryId: string = createRes.body.data.tasks[0].id;

    const entryUpdate = await request(app)
      .patch(`/api/tasks/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Entry updated',
        status: 'DONE',
        description: 'wrapped up',
        order: 5,
        attachments: [{ url: 'https://example.com/entry-updated', label: 'ref' }]
      })
      .expect(200);

    expect(entryUpdate.body.data.title).toBe('Entry updated');
    expect(entryUpdate.body.data.status).toBe('DONE');
    expect(entryUpdate.body.data.order).toBe(5);
    expect(entryUpdate.body.data.attachments).toHaveLength(1);

    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const lockedDate = new Date(Date.UTC(yesterday.getUTCFullYear(), yesterday.getUTCMonth(), yesterday.getUTCDate()));
    await prisma.taskPlan.update({
      where: { id: planId },
      data: { workDate: lockedDate }
    });

    await request(app)
      .patch(`/api/tasks/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'PLANNED' })
      .expect(409);
  });
});
