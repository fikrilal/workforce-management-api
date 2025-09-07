import type { Payslip } from './payslip';

export interface PayslipRepository {
  findByPeriod(params: { userId: string; year: number; month: number }): Promise<Payslip | null>;
  listByUser(params: {
    userId: string;
    year?: number;
    month?: number;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: Payslip[]; total: number }>;
}

