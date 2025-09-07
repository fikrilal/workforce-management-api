import { prisma } from "../../database";
import type { AttendanceRepository } from "../../../domain/attendance/attendance.repository";
import type { AttendanceSession } from "../../../domain/attendance/attendance";

// infer the exact enum type for `method` from the prisma client to stay compatible
// with differing client shapes across environments (windows vs wsl) without using `any`.
type CreateArgs = Parameters<typeof prisma.attendanceSession.create>[0];
type MethodType = CreateArgs extends { data: infer D }
  ? D extends { method?: infer M }
    ? M
    : never
  : never;

function toEntity(row: any): AttendanceSession {
  return {
    id: row.id,
    userId: row.userId,
    workDate: row.workDate,
    clockInAt: row.clockInAt,
    clockOutAt: row.clockOutAt,
    minutesWorked: row.minutesWorked,
    note: row.note,
    method: row.method,
  };
}

export const attendanceRepositoryPrisma: AttendanceRepository = {
  async findOpenSessionByUser(userId: string) {
    const row = await prisma.attendanceSession.findFirst({
      where: { userId, clockOutAt: null },
      orderBy: { clockInAt: "desc" },
    });
    return row ? toEntity(row) : null;
  },
  async createSession(params) {
    const row = await prisma.attendanceSession.create({
      data: {
        userId: params.userId,
        workDate: params.workDate,
        clockInAt: params.clockInAt,
        note: params.note ?? null,
        method: params.method as MethodType,
      },
    });
    return toEntity(row);
  },
  async closeSession(params) {
    const row = await prisma.attendanceSession.update({
      where: { id: params.id },
      data: {
        clockOutAt: params.clockOutAt,
        minutesWorked: params.minutesWorked,
      },
    });
    return toEntity(row);
  },
  async listByUser({ userId, from, to, page = 1, pageSize = 20 }) {
    const where: any = { userId };
    if (from || to) {
      where.workDate = {};
      if (from) where.workDate.gte = from;
      if (to) where.workDate.lte = to;
    }
    const take = Math.min(pageSize, 100);
    const skip = (Math.max(1, page) - 1) * take;
    const [rows, total] = await Promise.all([
      prisma.attendanceSession.findMany({
        where,
        orderBy: [{ workDate: "desc" }, { clockInAt: "desc" }],
        skip,
        take,
      }),
      prisma.attendanceSession.count({ where }),
    ]);
    return { items: rows.map(toEntity), total };
  },
};
