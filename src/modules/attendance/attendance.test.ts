import request from "supertest";
import { createServer } from "../../infrastructure/http/server";
import { prisma } from "../../infrastructure/database";

const app = createServer();

async function registerAndLogin() {
  const email = `att_${Date.now()}@example.com`;
  const password = "password123";
  await request(app)
    .post("/api/auth/register")
    .send({ email, password, fullName: "Att Tester" })
    .expect(201);
  const login = await request(app)
    .post("/api/auth/login")
    .send({ email, password })
    .expect(200);
  return { token: login.body.data.token as string };
}

beforeEach(async () => {
  await prisma.leaveRequest.deleteMany();
  await prisma.attendanceSession.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Attendance", () => {
  it("allows clock-in and clock-out, and prevents duplicate open sessions", async () => {
    const { token } = await registerAndLogin();

    const ci = await request(app)
      .post("/api/attendance/clock-in")
      .set("Authorization", `Bearer ${token}`)
      .send({ note: "starting my day", method: "WEB" });
    expect(ci.status).toBe(201);
    expect(ci.body.data).toHaveProperty("id");
    expect(ci.body.data.clockOutAt).toBeNull();

    const ciAgain = await request(app)
      .post("/api/attendance/clock-in")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(ciAgain.status).toBe(409);
    expect(ciAgain.body.error.code).toBe("SESSION_OPEN");

    const co = await request(app)
      .post("/api/attendance/clock-out")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(co.status).toBe(200);
    expect(co.body.data.clockOutAt).toBeTruthy();
    expect(co.body.data.minutesWorked).toBeGreaterThanOrEqual(0);

    const now = new Date();
    const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const list = await request(app)
      .get(`/api/attendance?page=1&pageSize=10&month=${ym}&method=WEB&status=closed`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(list.body.data)).toBe(true);
    expect(list.body.meta).toMatchObject({ page: 1, pageSize: 10 });
    expect(list.body.meta.total).toBeGreaterThanOrEqual(1);
  });

  it("rejects clock-out when no open session", async () => {
    const { token } = await registerAndLogin();
    const co = await request(app)
      .post("/api/attendance/clock-out")
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(co.status).toBe(409);
    expect(co.body.error.code).toBe("NO_OPEN_SESSION");
  });
});
