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
});
