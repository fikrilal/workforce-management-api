import { useCases } from '../../application/container';
import type { TaskPayload } from '../../application/tasks/task-input.helpers';

type PlanPayload = {
  summary?: string | null;
  tasks: TaskPayload[];
};

async function createTodayPlan(userId: string, payload: PlanPayload) {
  return useCases.createTaskPlan.execute({
    userId,
    summary: payload.summary ?? null,
    tasks: payload.tasks
  });
}

async function updateTodayPlan(userId: string, planId: string, payload: PlanPayload) {
  return useCases.updateTaskPlan.execute({
    userId,
    planId,
    summary: payload.summary ?? null,
    tasks: payload.tasks
  });
}

export const tasksService = { createTodayPlan, updateTodayPlan };
