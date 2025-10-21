import { AppError } from '../../shared/errors/app-error';
import type { TaskEntryInput } from '../../domain/tasks/task-plan.repository';
import type { TaskStatus } from '../../domain/tasks/task-status';
import type { TaskAttachmentLink } from '../../domain/tasks/task-attachment';

export type AttachmentPayload = {
  url: string;
  label?: string | null;
  description?: string | null;
};

export type TaskPayload = {
  title: string;
  description?: string | null;
  status?: string | null;
  order?: number | null;
  attachments?: AttachmentPayload[] | null;
};

export type TaskUpdatePayload = {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  order?: number | null;
  attachments?: AttachmentPayload[] | null;
};

const TASK_STATUS_VALUES: TaskStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE'];
const MAX_ATTACHMENTS_PER_TASK = 5;
const MAX_SUMMARY_LENGTH = 500;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_LABEL_LENGTH = 120;
const MAX_ATTACHMENT_DESCRIPTION_LENGTH = 500;

export function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function normalizeSummary(summary?: string | null): string | null {
  if (!summary) return null;
  const trimmed = summary.trim();
  if (!trimmed) return null;
  if (trimmed.length > MAX_SUMMARY_LENGTH) {
    throw new AppError(`summary must be at most ${MAX_SUMMARY_LENGTH} characters`, 422, 'VALIDATION_ERROR');
  }
  return trimmed;
}

function ensureValidStatus(status: string | null | undefined): TaskStatus {
  if (status == null) return 'PLANNED';
  const normalized = status.toUpperCase();
  if (!TASK_STATUS_VALUES.includes(normalized as TaskStatus)) {
    throw new AppError('invalid task status', 422, 'VALIDATION_ERROR');
  }
  return normalized as TaskStatus;
}

export function normalizeAttachments(input: AttachmentPayload[] | null | undefined): TaskEntryInput['attachments'] {
  if (!input || input.length === 0) return [];
  if (input.length > MAX_ATTACHMENTS_PER_TASK) {
    throw new AppError(`attachments per task must not exceed ${MAX_ATTACHMENTS_PER_TASK}`, 422, 'VALIDATION_ERROR');
  }
  const seen = new Set<string>();
  const result: TaskEntryInput['attachments'] = [];
  for (const item of input) {
    if (!item || typeof item.url !== 'string') {
      throw new AppError('attachment url is required', 422, 'VALIDATION_ERROR');
    }
    const trimmedUrl = item.url.trim();
    if (!trimmedUrl) {
      throw new AppError('attachment url is required', 422, 'VALIDATION_ERROR');
    }
    let parsed: URL;
    try {
      parsed = new URL(trimmedUrl);
    } catch {
      throw new AppError('attachment url must be a valid https url', 422, 'VALIDATION_ERROR');
    }
    if (parsed.protocol !== 'https:') {
      throw new AppError('attachment url must use https', 422, 'VALIDATION_ERROR');
    }
    const key = parsed.toString().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const label = item.label ? item.label.trim() : null;
    if (label && label.length > MAX_LABEL_LENGTH) {
      throw new AppError(`attachment label must be at most ${MAX_LABEL_LENGTH} characters`, 422, 'VALIDATION_ERROR');
    }
    const description = item.description ? item.description.trim() : null;
    if (description && description.length > MAX_ATTACHMENT_DESCRIPTION_LENGTH) {
      throw new AppError(
        `attachment description must be at most ${MAX_ATTACHMENT_DESCRIPTION_LENGTH} characters`,
        422,
        'VALIDATION_ERROR'
      );
    }
    result.push({
      url: parsed.toString(),
      label,
      description
    });
  }
  return result;
}

export function normalizeTasks(tasks: TaskPayload[]): TaskEntryInput[] {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new AppError('tasks must contain at least one item', 422, 'VALIDATION_ERROR');
  }
  return tasks.map((task, index) => {
    if (!task || typeof task.title !== 'string') {
      throw new AppError('task title is required', 422, 'VALIDATION_ERROR');
    }
    const title = task.title.trim();
    if (!title) {
      throw new AppError('task title is required', 422, 'VALIDATION_ERROR');
    }
    if (title.length > MAX_TITLE_LENGTH) {
      throw new AppError(`task title must be at most ${MAX_TITLE_LENGTH} characters`, 422, 'VALIDATION_ERROR');
    }
    const description = task.description ? task.description.trim() : null;
    if (description && description.length > MAX_DESCRIPTION_LENGTH) {
      throw new AppError(
        `task description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
        422,
        'VALIDATION_ERROR'
      );
    }
    const status = ensureValidStatus(task.status);
    const order =
      typeof task.order === 'number' && Number.isInteger(task.order) && task.order >= 0 ? task.order : index;
    return {
      title,
      description,
      status,
      order,
      completedAt: null,
      attachments: normalizeAttachments(task.attachments)
    };
  });
}

export function normalizeTaskUpdate(
  payload: TaskUpdatePayload,
  current: {
    title: string;
    description: string | null;
    status: TaskStatus;
    order: number;
    attachments: TaskAttachmentLink[];
  }
) {
  const titleSrc = payload.title !== undefined && payload.title !== null ? payload.title : current.title;
  if (typeof titleSrc !== 'string') throw new AppError('task title is required', 422, 'VALIDATION_ERROR');
  const title = titleSrc.trim();
  if (!title) throw new AppError('task title is required', 422, 'VALIDATION_ERROR');
  if (title.length > MAX_TITLE_LENGTH) {
    throw new AppError(`task title must be at most ${MAX_TITLE_LENGTH} characters`, 422, 'VALIDATION_ERROR');
  }

  let description: string | null = current.description;
  if (payload.description !== undefined) {
    if (payload.description === null) {
      description = null;
    } else if (typeof payload.description === 'string') {
      const trimmed = payload.description.trim();
      if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
        throw new AppError(`task description must be at most ${MAX_DESCRIPTION_LENGTH} characters`, 422, 'VALIDATION_ERROR');
      }
      description = trimmed || null;
    } else {
      throw new AppError('task description must be a string', 422, 'VALIDATION_ERROR');
    }
  }

  const status = payload.status !== undefined && payload.status !== null
    ? ensureValidStatus(payload.status)
    : current.status;

  let order = current.order;
  if (payload.order !== undefined && payload.order !== null) {
    if (!Number.isInteger(payload.order) || payload.order < 0) {
      throw new AppError('task order must be a non-negative integer', 422, 'VALIDATION_ERROR');
    }
    order = payload.order;
  }

  const attachmentInput =
    payload.attachments !== undefined
      ? payload.attachments ?? []
      : current.attachments.map((item) => ({
          url: item.url,
          label: item.label ?? undefined,
          description: item.description ?? undefined
        }));

  const attachments = normalizeAttachments(attachmentInput);

  return { title, description, status, order, attachments };
}
