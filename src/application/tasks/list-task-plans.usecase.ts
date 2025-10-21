import type { TaskPlanRepository } from '../../domain/tasks/task-plan.repository';
import type { TaskPlan } from '../../domain/tasks/task-plan';
import { AppError } from '../../shared/errors/app-error';

export type ListTaskPlansInput = {
  userId: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
};

export type ListTaskPlansResult = {
  items: TaskPlan[];
  meta: { total: number; page: number; pageSize: number };
};

export function makeListTaskPlans(taskPlanRepo: TaskPlanRepository) {
  return {
    async execute(input: ListTaskPlansInput): Promise<ListTaskPlansResult> {
      if (input.from && input.to && input.from > input.to) {
        throw new AppError('from must be before to', 422, 'VALIDATION_ERROR');
      }
      const page = input.page && input.page > 0 ? input.page : 1;
      const pageSize = input.pageSize && input.pageSize > 0 ? input.pageSize : 10;
      const result = await taskPlanRepo.listByUser({
        userId: input.userId,
        from: input.from,
        to: input.to,
        page,
        pageSize
      });
      return {
        items: result.items,
        meta: { total: result.total, page, pageSize }
      };
    }
  };
}
