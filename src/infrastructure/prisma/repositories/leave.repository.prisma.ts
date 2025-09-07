import { prisma } from '../../database';
import type { LeaveRepository } from '../../../domain/leave/leave.repository';
import type { LeaveRequest } from '../../../domain/leave/leave';

type CreateArgs = Parameters<typeof prisma.leaveRequest.create>[0];
type UpdateArgs = Parameters<typeof prisma.leaveRequest.update>[0];
type PrismaLeaveType = CreateArgs extends { data: infer D } ? (D extends { type?: infer T } ? T : never) : never;
type PrismaLeaveStatusCreate = CreateArgs extends { data: infer D } ? (D extends { status?: infer S } ? S : never) : never;
type PrismaLeaveStatusUpdate = UpdateArgs extends { data: infer D } ? (D extends { status?: infer S } ? S : never) : never;

function toEntity(row: any): LeaveRequest {
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    startDate: row.startDate,
    endDate: row.endDate,
    totalDays: row.totalDays,
    reason: row.reason,
    status: row.status,
    decidedAt: row.decidedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export const leaveRepositoryPrisma: LeaveRepository = {
  async create(params) {
    const row = await prisma.leaveRequest.create({
      data: {
        userId: params.userId,
        type: params.type as PrismaLeaveType,
        startDate: params.startDate,
        endDate: params.endDate,
        totalDays: params.totalDays,
        reason: params.reason ?? null,
        status: 'PENDING' as PrismaLeaveStatusCreate
      }
    });
    return toEntity(row);
  },
  async findById(id) {
    const row = await prisma.leaveRequest.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  },
  async cancel({ id, decidedAt }) {
    const row = await prisma.leaveRequest.update({ where: { id }, data: { status: { set: 'CANCELLED' } as PrismaLeaveStatusUpdate, decidedAt } });
    return toEntity(row);
  },
  async hasOverlap({ userId, startDate, endDate }) {
    const count = await prisma.leaveRequest.count({
      where: {
        userId,
        status: { in: ['PENDING', 'APPROVED'] as any },
        NOT: [{ endDate: { lt: startDate } }, { startDate: { gt: endDate } }]
      }
    });
    return count > 0;
  },
  async listByUser({ userId, from, to, type, status, page = 1, pageSize = 20 }) {
    const where: any = { userId };
    if (from || to) {
      where.startDate = {};
      if (from) where.startDate.gte = from;
      if (to) where.startDate.lte = to;
    }
    if (type) where.type = type as PrismaLeaveType;
    if (status) where.status = status as any;
    const take = Math.min(pageSize, 100);
    const skip = (Math.max(1, page) - 1) * take;
    const [rows, total] = await Promise.all([
      prisma.leaveRequest.findMany({ where, orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }], skip, take }),
      prisma.leaveRequest.count({ where })
    ]);
    return { items: rows.map(toEntity), total };
  }
};
