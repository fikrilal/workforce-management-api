import type { CheckinMethod } from './checkin-method';

export type AttendanceSession = {
  id: string;
  userId: string;
  workDate: Date;
  clockInAt: Date;
  clockOutAt: Date | null;
  minutesWorked: number | null;
  note: string | null;
  method: CheckinMethod;
};
