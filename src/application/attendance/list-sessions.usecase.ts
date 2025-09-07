import type { AttendanceRepository } from "../../domain/attendance/attendance.repository";

export type ListSessionsInput = {
  userId: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
};

export function makeListSessions(attRepo: AttendanceRepository) {
  return {
    async execute(input: ListSessionsInput) {
      const page = input.page && input.page > 0 ? input.page : 1;
      const pageSize =
        input.pageSize && input.pageSize > 0
          ? Math.min(input.pageSize, 100)
          : 20;
      const { items, total } = await attRepo.listByUser({
        ...input,
        page,
        pageSize,
      });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      return { items, meta: { page, pageSize, total, totalPages } };
    },
  };
}
