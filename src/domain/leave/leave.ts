import type { LeaveType } from './leave-type';
import type { LeaveStatus } from './leave-status';

export type LeaveRequest = {
  id: string;
  userId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string | null;
  status: LeaveStatus;
  decidedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

