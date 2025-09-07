import { Request, Response } from 'express';
import { useCases } from '../../application/container';
import { ResponseUtils } from '../../shared/utils/response-utils';

async function list(req: Request, res: Response) {
  const { year, month, page, pageSize } = req.query as { year?: string; month?: string; page?: string; pageSize?: string };
  const result = await useCases.listPayslips.execute({
    userId: req.user!.id,
    year: year ? parseInt(year, 10) : undefined,
    month: month ? parseInt(month, 10) : undefined,
    page: page ? parseInt(page, 10) : undefined,
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined
  });
  return ResponseUtils.ok(res, result.items, result.meta);
}

async function getByPeriod(req: Request, res: Response) {
  const { year, month } = req.params as { year: string; month: string };
  const slip = await useCases.getPayslip.execute({ userId: req.user!.id, year: parseInt(year, 10), month: parseInt(month, 10) });
  return ResponseUtils.ok(res, slip);
}

export const payslipsController = { list, getByPeriod };

