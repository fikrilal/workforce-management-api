import type { TaskStatus } from './task-status';
import type { TaskAttachmentLink } from './task-attachment';

export type TaskEntry = {
  id: string;
  taskPlanId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  order: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  attachments: TaskAttachmentLink[];
};
