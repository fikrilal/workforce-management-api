import type { PayslipRepository } from '../../domain/payslip/payslip.repository';
import { AppError } from '../../shared/errors/app-error';

export function makeGetPayslip(repo: PayslipRepository) {
  return {
    async execute(params: { userId: string; year: number; month: number }) {
      const slip = await repo.findByPeriod(params);
      if (!slip) throw new AppError('Payslip not found', 404, 'NOT_FOUND');
      return slip;
    }
  };
}

