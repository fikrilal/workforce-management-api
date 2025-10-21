import type { TaskPlanRepository } from '../../domain/tasks/task-plan.repository';
import type { TaskEntry } from '../../domain/tasks/task-entry';
import { AppError } from '../../shared/errors/app-error';
import { startOfUtcDay, normalizeTaskUpdate, type TaskUpdatePayload } from './task-input.helpers';

export type UpdateTaskEntryInput = {
  userId: string;
  entryId: string;
  payload: TaskUpdatePayload;
};

export function makeUpdateTaskEntry(taskPlanRepo: TaskPlanRepository) {
  return {
    async execute(input: UpdateTaskEntryInput): Promise<TaskEntry> {
      const entry = await taskPlanRepo.findEntryById(input.entryId);
      if (!entry) {
        throw new AppError('Task entry not found', 404, 'ENTRY_NOT_FOUND');
      }
      const plan = await taskPlanRepo.findById(entry.taskPlanId);
      if (!plan || plan.userId !== input.userId) {
        throw new AppError('Task entry not found', 404, 'ENTRY_NOT_FOUND');
      }
      const today = startOfUtcDay(new Date());
      if (plan.workDate.getTime() !== today.getTime()) {
        throw new AppError('plan can no longer be updated', 409, 'PLAN_LOCKED');
      }

      const normalized = normalizeTaskUpdate(input.payload, entry);

      const updated = await taskPlanRepo.updateEntry({
        entryId: entry.id,
        title: normalized.title,
        description: normalized.description ?? null,
        status: normalized.status,
        order: normalized.order,
        completedAt: entry.completedAt ?? null,
        attachments: normalized.attachments
      });
      return updated;
    }
  };
}
