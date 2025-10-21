import { Request, Response } from 'express';
import { ResponseUtils } from '../../shared/utils/response-utils';
import { tasksService } from './tasks.service';
import type { TaskPayload } from '../../application/tasks/task-input.helpers';

type PlanRequestBody = {
  summary?: string | null;
  tasks: TaskPayload[];
};

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

export const tasksController = { createPlan, updatePlan };
