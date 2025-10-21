import type { TaskPlan } from './task-plan';
import type { TaskStatus } from './task-status';

export type TaskAttachmentInput = {
  url: string;
  label?: string | null;
  description?: string | null;
};

export type TaskEntryInput = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  order: number;
  completedAt?: Date | null;
  attachments: TaskAttachmentInput[];
};

export interface TaskPlanRepository {
  findById(planId: string): Promise<TaskPlan | null>;
  findByUserAndDate(userId: string, workDate: Date): Promise<TaskPlan | null>;
  createPlan(params: {
    userId: string;
    workDate: Date;
    summary?: string | null;
    tasks: TaskEntryInput[];
  }): Promise<TaskPlan>;
  replacePlan(params: {
    planId: string;
    summary?: string | null;
    tasks: TaskEntryInput[];
  }): Promise<TaskPlan>;
  listByUser(params: {
    userId: string;
    from?: Date;
    to?: Date;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: TaskPlan[]; total: number }>;
}
