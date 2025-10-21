import type { TaskPlanRepository } from '../../domain/tasks/task-plan.repository';
import type { TaskPlan } from '../../domain/tasks/task-plan';
import { AppError } from '../../shared/errors/app-error';
import {
  normalizeSummary,
  normalizeTasks,
  startOfUtcDay,
  type TaskPayload
} from './task-input.helpers';

export type CreateTaskPlanInput = {
  userId: string;
  summary?: string | null;
  tasks: TaskPayload[];
};

export function makeCreateTaskPlan(taskPlanRepo: TaskPlanRepository) {
  return {
    async execute(input: CreateTaskPlanInput): Promise<TaskPlan> {
      const todayUtc = startOfUtcDay(new Date());
      const existing = await taskPlanRepo.findByUserAndDate(input.userId, todayUtc);
      if (existing) {
        throw new AppError('plan already exists for today', 409, 'PLAN_EXISTS');
      }
      const tasks = normalizeTasks(input.tasks);
      const summary = normalizeSummary(input.summary);
      return taskPlanRepo.createPlan({
        userId: input.userId,
        workDate: todayUtc,
        summary,
        tasks
      });
    }
  };
}
