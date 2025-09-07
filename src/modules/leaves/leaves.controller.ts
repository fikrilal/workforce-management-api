import { Request, Response } from 'express';
import { useCases } from '../../application/container';
import { ResponseUtils } from '../../shared/utils/response-utils';
import type { LeaveType } from '../../domain/leave/leave-type';
import type { LeaveStatus } from '../../domain/leave/leave-status';

async function create(req: Request, res: Response) {
  const { type, startDate, endDate, reason } = req.body as {
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason?: string;
  };
  const result = await useCases.createLeave.execute({
    userId: req.user!.id,
    type,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason
  });
  return ResponseUtils.created(res, result);
}

async function cancel(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const result = await useCases.cancelLeave.execute({ id, userId: req.user!.id });
  return ResponseUtils.ok(res, result);
}

async function list(req: Request, res: Response) {
  const { from, to, month, year, type, status, page, pageSize } = req.query as unknown as {
    from?: string;
    to?: string;
    month?: string;
    year?: string;
    type?: LeaveType;
    status?: LeaveStatus;
    page?: string;
    pageSize?: string;
  };
  let fromDate = from ? new Date(from) : undefined;
  let toDate = to ? new Date(to) : undefined;
  if (!fromDate && !toDate) {
    if (month) {
      const [y, m] = month.split('-').map((v) => parseInt(v, 10));
      fromDate = new Date(Date.UTC(y, m - 1, 1));
      toDate = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
    } else if (year) {
      const y = parseInt(year, 10);
      fromDate = new Date(Date.UTC(y, 0, 1));
      toDate = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
    }
  }
  const result = await useCases.listLeaves.execute({
    userId: req.user!.id,
    from: fromDate,
    to: toDate,
    type,
    status,
    page: page ? parseInt(page, 10) : undefined,
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined
  });
  return ResponseUtils.ok(res, result.items, result.meta);
}

export const leavesController = { create, cancel, list };

