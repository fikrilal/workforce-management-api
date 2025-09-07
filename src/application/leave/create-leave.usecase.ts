import type { LeaveRepository } from '../../domain/leave/leave.repository';
import type { LeaveType } from '../../domain/leave/leave-type';
import { AppError } from '../../shared/errors/app-error';

export type CreateLeaveInput = { userId: string; type: LeaveType; startDate: Date; endDate: Date; reason?: string | null };

function daysBetweenInclusive(start: Date, end: Date) {
  const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const endUTC = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  return Math.floor((endUTC - startUTC) / 86_400_000) + 1;
}

export function makeCreateLeave(repo: LeaveRepository) {
  return {
    async execute(input: CreateLeaveInput) {
      if (input.endDate < input.startDate) throw new AppError('endDate must be on/after startDate', 422, 'VALIDATION_ERROR');
      const totalDays = daysBetweenInclusive(input.startDate, input.endDate);
      if (totalDays < 1 || totalDays > 30) throw new AppError('range must be 1-30 days', 422, 'VALIDATION_ERROR');
      if (input.reason && input.reason.length > 500) throw new AppError('reason too long', 422, 'VALIDATION_ERROR');

      const overlap = await repo.hasOverlap({ userId: input.userId, startDate: input.startDate, endDate: input.endDate });
      if (overlap) throw new AppError('Overlapping leave request', 409, 'LEAVE_OVERLAP');

      return repo.create({
        userId: input.userId,
        type: input.type,
        startDate: input.startDate,
        endDate: input.endDate,
        totalDays,
        reason: input.reason ?? null
      });
    }
  };
}

