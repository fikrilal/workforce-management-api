import type { PayslipRepository } from '../../domain/payslip/payslip.repository';

export type ListPayslipsInput = { userId: string; year?: number; month?: number; page?: number; pageSize?: number };

export function makeListPayslips(repo: PayslipRepository) {
  return {
    async execute(input: ListPayslipsInput) {
      const page = input.page && input.page > 0 ? input.page : 1;
      const pageSize = input.pageSize && input.pageSize > 0 ? Math.min(input.pageSize, 100) : 20;
      const { items, total } = await repo.listByUser({ userId: input.userId, year: input.year, month: input.month, page, pageSize });
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      return { items, meta: { page, pageSize, total, totalPages } };
    }
  };
}

