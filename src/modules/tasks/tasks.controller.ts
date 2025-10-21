import { Request, Response } from 'express';
import { ResponseUtils } from '../../shared/utils/response-utils';
import { tasksService } from './tasks.service';
import type { TaskPayload, TaskUpdatePayload } from '../../application/tasks/task-input.helpers';

type PlanRequestBody = {
  summary?: string | null;
  tasks: TaskPayload[];
};

type EntryUpdateBody = TaskUpdatePayload;

async function createPlan(req: Request, res: Response) {
  const { summary, tasks } = req.body as PlanRequestBody;
  const plan = await tasksService.createTodayPlan(req.user!.id, { summary, tasks });
  return ResponseUtils.created(res, plan);
}

async function updatePlan(req: Request, res: Response) {
  const { summary, tasks } = req.body as PlanRequestBody;
  const planId = req.params.planId;
  const plan = await tasksService.updateTodayPlan(req.user!.id, planId, { summary, tasks });
  return ResponseUtils.ok(res, plan);
}

async function getTodayPlan(req: Request, res: Response) {
  const plan = await tasksService.getTodayPlan(req.user!.id);
  return ResponseUtils.ok(res, plan);
}

async function listHistory(req: Request, res: Response) {
  const { from, to, page, pageSize } = req.query as {
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
  };
  const result = await tasksService.listHistory(req.user!.id, {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    page: page ? parseInt(page, 10) : undefined,
    pageSize: pageSize ? parseInt(pageSize, 10) : undefined
  });
  return ResponseUtils.ok(res, result.items, result.meta);
}

async function updateEntry(req: Request, res: Response) {
  const entryId = req.params.entryId;
  const payload = req.body as EntryUpdateBody;
  const entry = await tasksService.updateEntry(req.user!.id, entryId, payload);
  return ResponseUtils.ok(res, entry);
}

export const tasksController = { createPlan, updatePlan, getTodayPlan, listHistory, updateEntry };
