import type { LeaveRepository } from '../../domain/leave/leave.repository';
import type { LeaveType } from '../../domain/leave/leave-type';
import type { LeaveStatus } from '../../domain/leave/leave-status';

export type ListLeavesInput = {
  userId: string;
  from?: Date;
  to?: Date;
  month?: string;
  year?: number;
  type?: LeaveType;
  status?: LeaveStatus;
  page?: number;
  pageSize?: number;
};

export function makeListLeaves(repo: LeaveRepository) {
  return {
    async execute(input: ListLeavesInput) {
      let from = input.from;
      let to = input.to;
      if (!from && !to) {
        if (input.month) {
          const [y, m] = input.month.split('-').map((v) => parseInt(v, 10));
          from = new Date(Date.UTC(y, m - 1, 1));
          to = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
        } else if (input.year) {
          from = new Date(Date.UTC(input.year, 0, 1));
          to = new Date(Date.UTC(input.year, 11, 31, 23, 59, 59, 999));
        }
      }
      const page = input.page && input.page > 0 ? input.page : 1;
      const pageSize = input.pageSize && input.pageSize > 0 ? Math.min(input.pageSize, 100) : 20;
      const { items, total } = await repo.listByUser({ userId: input.userId, from, to, type: input.type, status: input.status, page, pageSize });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      return { items, meta: { page, pageSize, total, totalPages } };
    }
  };
}

