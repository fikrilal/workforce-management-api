import type { TaskPlanRepository } from '../../domain/tasks/task-plan.repository';
import type { TaskPlan } from '../../domain/tasks/task-plan';
import { AppError } from '../../shared/errors/app-error';
import { startOfUtcDay } from './task-input.helpers';

export type GetTodayTaskPlanInput = {
  userId: string;
};

export function makeGetTodayTaskPlan(taskPlanRepo: TaskPlanRepository) {
  return {
    async execute(input: GetTodayTaskPlanInput): Promise<TaskPlan> {
      const today = startOfUtcDay(new Date());
      const plan = await taskPlanRepo.findByUserAndDate(input.userId, today);
      if (!plan) throw new AppError('Task plan not found', 404, 'PLAN_NOT_FOUND');
      return plan;
    }
  };
}
