import type { LeaveRepository } from '../../domain/leave/leave.repository';
import { AppError, ForbiddenError } from '../../shared/errors/app-error';

export function makeCancelLeave(repo: LeaveRepository) {
  return {
    async execute(params: { id: string; userId: string }) {
      const leave = await repo.findById(params.id);
      if (!leave) throw new AppError('Leave not found', 404, 'NOT_FOUND');
      if (leave.userId !== params.userId) throw new ForbiddenError('Not your leave request');
      if (leave.status !== 'PENDING') throw new AppError('Cannot cancel this request', 409, 'CANNOT_CANCEL');
      return repo.cancel({ id: leave.id, decidedAt: new Date() });
    }
  };
}

