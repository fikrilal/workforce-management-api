import { useCases } from '../../application/container';
import type { TaskPayload, TaskUpdatePayload } from '../../application/tasks/task-input.helpers';

type PlanPayload = {
  summary?: string | null;
  tasks: TaskPayload[];
};

type HistoryQuery = {
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
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

async function getTodayPlan(userId: string) {
  return useCases.getTodayTaskPlan.execute({ userId });
}

async function listHistory(userId: string, query: HistoryQuery) {
  return useCases.listTaskPlans.execute({
    userId,
    from: query.from,
    to: query.to,
    page: query.page,
    pageSize: query.pageSize
  });
}

async function updateEntry(userId: string, entryId: string, payload: TaskUpdatePayload) {
  return useCases.updateTaskEntry.execute({
    userId,
    entryId,
    payload
  });
}

export const tasksService = { createTodayPlan, updateTodayPlan, getTodayPlan, listHistory, updateEntry };
