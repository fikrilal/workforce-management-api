import type { TaskEntry } from './task-entry';

export type TaskPlan = {
  id: string;
  userId: string;
  workDate: Date;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: TaskEntry[];
};
