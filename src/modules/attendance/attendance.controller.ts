import { Request, Response } from "express";
import { useCases } from "../../application/container";
import { ResponseUtils } from "../../shared/utils/response-utils";
import type { CheckinMethod } from "../../domain/attendance/checkin-method";

async function clockIn(req: Request, res: Response) {
  const { note, method } = req.body as { note?: string; method?: CheckinMethod };
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
  const { from, to } = req.query as { from?: string; to?: string };
  const sessions = await useCases.listAttendance.execute({
    userId: req.user!.id,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });
  return ResponseUtils.ok(res, sessions);
}

export const attendanceController = { clockIn, clockOut, list };
