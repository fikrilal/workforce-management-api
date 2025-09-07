import type { AttendanceRepository } from "../../domain/attendance/attendance.repository";
import { AppError } from "../../shared/errors/app-error";
import type { CheckinMethod } from "../../domain/attendance/checkin-method";

export type ClockInInput = {
  userId: string;
  note?: string;
  method?: CheckinMethod;
};

export function makeClockIn(attRepo: AttendanceRepository) {
  return {
    async execute(input: ClockInInput) {
      const open = await attRepo.findOpenSessionByUser(input.userId);
      if (open) throw new AppError("Session already open", 409, "SESSION_OPEN");
      const now = new Date();
      const workDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      return attRepo.createSession({
        userId: input.userId,
        workDate,
        clockInAt: now,
        note: input.note ?? null,
        method: input.method ?? "WEB",
      });
    },
  };
}
