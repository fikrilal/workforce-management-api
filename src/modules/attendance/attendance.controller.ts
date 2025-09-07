import { Request, Response } from "express";
import { useCases } from "../../application/container";
import { ResponseUtils } from "../../shared/utils/response-utils";
import type { CheckinMethod } from "../../domain/attendance/checkin-method";

async function clockIn(req: Request, res: Response) {
  const { note, method } = req.body as {
    note?: string;
    method?: CheckinMethod;
  };
  const session = await useCases.clockIn.execute({
    userId: req.user!.id,
    note,
    method,
  });
  return ResponseUtils.created(res, session);
}

async function clockOut(_req: Request, res: Response) {
  const session = await useCases.clockOut.execute({ userId: res.req.user!.id });
  return ResponseUtils.ok(res, session);
}

async function list(req: Request, res: Response) {
  const { from, to, month, year, method, status, page, pageSize } = req.query as {
    from?: string;
    to?: string;
    month?: string;
    year?: string;
    method?: string;
    status?: 'open' | 'closed';
    page?: string;
    pageSize?: string;
  };

  let fromDate = from ? new Date(from) : undefined;
  let toDate = to ? new Date(to) : undefined;
  if (!fromDate && !toDate) {
    if (month) {
      const [y, m] = month.split('-').map((v) => parseInt(v, 10));
      const start = new Date(Date.UTC(y, m - 1, 1));
      const end = new Date(Date.UTC(y, m, 0, 23, 59, 59, 999));
      fromDate = start;
      toDate = end;
    } else if (year) {
      const y = parseInt(year, 10);
      const start = new Date(Date.UTC(y, 0, 1));
      const end = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
      fromDate = start;
      toDate = end;
    }
  }

  const result = await useCases.listAttendance.execute({
    userId: req.user!.id,
    from: fromDate,
    to: toDate,
    method: method as any,
    status,
    page: page ? parseInt(page, 10) : undefined,
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
  });
  return ResponseUtils.ok(res, result.items, result.meta);
}

export const attendanceController = { clockIn, clockOut, list };
