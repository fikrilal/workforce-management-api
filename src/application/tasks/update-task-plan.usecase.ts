import type { TaskPlanRepository } from '../../domain/tasks/task-plan.repository';
import type { TaskPlan } from '../../domain/tasks/task-plan';
import { AppError } from '../../shared/errors/app-error';
import {
  normalizeSummary,
  normalizeTasks,
  startOfUtcDay,
  type TaskPayload
} from './task-input.helpers';

export type UpdateTaskPlanInput = {
  userId: string;
  planId: string;
  summary?: string | null;
  tasks: TaskPayload[];
};

export function makeUpdateTaskPlan(taskPlanRepo: TaskPlanRepository) {
  return {
    async execute(input: UpdateTaskPlanInput): Promise<TaskPlan> {
      const plan = await taskPlanRepo.findById(input.planId);
      if (!plan || plan.userId !== input.userId) {
        throw new AppError('task plan not found', 404, 'PLAN_NOT_FOUND');
      }
      const todayUtc = startOfUtcDay(new Date());
      if (plan.workDate.getTime() !== todayUtc.getTime()) {
        throw new AppError('plan can no longer be updated', 409, 'PLAN_LOCKED');
      }
      const tasks = normalizeTasks(input.tasks);
      const summary = normalizeSummary(input.summary);
      return taskPlanRepo.replacePlan({
        planId: input.planId,
        summary,
        tasks
      });
    }
  };
}
