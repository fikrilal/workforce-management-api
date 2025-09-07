import type { LeaveRequest } from './leave';
import type { LeaveType } from './leave-type';
import type { LeaveStatus } from './leave-status';

export interface LeaveRepository {
  create(params: { userId: string; type: LeaveType; startDate: Date; endDate: Date; totalDays: number; reason?: string | null }): Promise<LeaveRequest>;
  findById(id: string): Promise<LeaveRequest | null>;
  cancel(params: { id: string; decidedAt: Date }): Promise<LeaveRequest>;
  hasOverlap(params: { userId: string; startDate: Date; endDate: Date }): Promise<boolean>;
  listByUser(params: {
    userId: string;
    from?: Date;
    to?: Date;
    type?: LeaveType;
    status?: LeaveStatus;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: LeaveRequest[]; total: number }>;
}

