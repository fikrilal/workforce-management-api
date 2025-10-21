import { prisma } from '../../database';
import type { TaskPlanRepository, TaskEntryInput, TaskAttachmentInput } from '../../../domain/tasks/task-plan.repository';
import type { TaskPlan } from '../../../domain/tasks/task-plan';
import type { TaskEntry } from '../../../domain/tasks/task-entry';
import type { TaskAttachmentLink } from '../../../domain/tasks/task-attachment';

function mapAttachment(row: {
  id: string;
  taskEntryId: string;
  label: string | null;
  url: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): TaskAttachmentLink {
  return {
    id: row.id,
    taskEntryId: row.taskEntryId,
    label: row.label,
    url: row.url,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function mapEntry(row: {
  id: string;
  taskPlanId: string;
  title: string;
  description: string | null;
  status: string;
  order: number;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  attachments: {
    id: string;
    taskEntryId: string;
    label: string | null;
    url: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}): TaskEntry {
  return {
    id: row.id,
    taskPlanId: row.taskPlanId,
    title: row.title,
    description: row.description,
    status: row.status as TaskEntry['status'],
    order: row.order,
    completedAt: row.completedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    attachments: row.attachments.map(mapAttachment)
  };
}

function mapPlan(row: {
  id: string;
  userId: string;
  workDate: Date;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: {
    id: string;
    taskPlanId: string;
    title: string;
    description: string | null;
    status: string;
    order: number;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    attachments: {
      id: string;
      taskEntryId: string;
      label: string | null;
      url: string;
      description: string | null;
      createdAt: Date;
      updatedAt: Date;
    }[];
  }[];
}): TaskPlan {
  return {
    id: row.id,
    userId: row.userId,
    workDate: row.workDate,
    summary: row.summary,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    tasks: row.tasks.map(mapEntry)
  };
}

function buildTaskData(task: TaskEntryInput) {
  return {
    title: task.title,
    description: task.description ?? null,
    status: task.status,
    order: task.order,
    completedAt: task.completedAt ?? null,
    attachments: {
      create: task.attachments.map((attachment: TaskAttachmentInput) => ({
        url: attachment.url,
        label: attachment.label ?? null,
        description: attachment.description ?? null
      }))
    }
  };
}

const planIncludes = {
  tasks: {
    include: { attachments: true },
    orderBy: { order: 'asc' as const }
  }
};

export const taskPlanRepositoryPrisma: TaskPlanRepository = {
  async findById(planId: string) {
    const row = await prisma.taskPlan.findUnique({
      where: { id: planId },
      include: planIncludes
    });
    return row ? mapPlan(row) : null;
  },

  async findByUserAndDate(userId: string, workDate: Date) {
    const row = await prisma.taskPlan.findFirst({
      where: { userId, workDate },
      include: planIncludes
    });
    return row ? mapPlan(row) : null;
  },

  async createPlan(params) {
    const row = await prisma.taskPlan.create({
      data: {
        userId: params.userId,
        workDate: params.workDate,
        summary: params.summary ?? null,
        tasks: {
          create: params.tasks.map(buildTaskData)
        }
      },
      include: planIncludes
    });
    return mapPlan(row);
  },

  async replacePlan(params) {
    const row = await prisma.taskPlan.update({
      where: { id: params.planId },
      data: {
        summary: params.summary ?? null,
        tasks: {
          deleteMany: {},
          create: params.tasks.map(buildTaskData)
        }
      },
      include: planIncludes
    });
    return mapPlan(row);
  }
};
