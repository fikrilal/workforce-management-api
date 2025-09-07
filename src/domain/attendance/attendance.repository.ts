import type { AttendanceSession } from "./attendance";
import type { CheckinMethod } from "./checkin-method";

export interface AttendanceRepository {
  findOpenSessionByUser(userId: string): Promise<AttendanceSession | null>;
  createSession(params: {
    userId: string;
    workDate: Date;
    clockInAt: Date;
    note?: string | null;
    method: CheckinMethod;
  }): Promise<AttendanceSession>;
  closeSession(params: {
    id: string;
    clockOutAt: Date;
    minutesWorked: number;
  }): Promise<AttendanceSession>;
  listByUser(params: {
    userId: string;
    from?: Date;
    to?: Date;
    method?: CheckinMethod;
    status?: 'open' | 'closed';
    page?: number;
    pageSize?: number;
  }): Promise<{ items: AttendanceSession[]; total: number }>;
}
