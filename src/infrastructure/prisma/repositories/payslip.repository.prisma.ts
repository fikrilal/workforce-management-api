import { prisma } from '../../database';
import type { PayslipRepository } from '../../../domain/payslip/payslip.repository';
import type { Payslip } from '../../../domain/payslip/payslip';

function toEntity(row: any): Payslip {
  return {
    id: row.id,
    userId: row.userId,
    year: row.year,
    month: row.month,
    currency: row.currency,
    gross: row.gross,
    net: row.net,
    items: row.items,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

export const payslipRepositoryPrisma: PayslipRepository = {
  async findByPeriod({ userId, year, month }) {
    const row = await prisma.payslip.findUnique({ where: { userId_year_month: { userId, year, month } } });
    return row ? toEntity(row) : null;
  },
  async listByUser({ userId, year, month, page = 1, pageSize = 20 }) {
    const where: any = { userId };
    if (year) where.year = year;
    if (month) where.month = month;
    const take = Math.min(pageSize, 100);
    const skip = (Math.max(1, page) - 1) * take;
    const [rows, total] = await Promise.all([
      prisma.payslip.findMany({ where, orderBy: [{ year: 'desc' }, { month: 'desc' }], skip, take }),
      prisma.payslip.count({ where })
    ]);
    return { items: rows.map(toEntity), total };
  }
};

