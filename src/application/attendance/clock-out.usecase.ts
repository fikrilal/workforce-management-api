import type { AttendanceRepository } from "../../domain/attendance/attendance.repository";
import { AppError } from "../../shared/errors/app-error";

export type ClockOutInput = { userId: string };

export function makeClockOut(attRepo: AttendanceRepository) {
  return {
    async execute(input: ClockOutInput) {
      const open = await attRepo.findOpenSessionByUser(input.userId);
      if (!open) throw new AppError("No open session", 409, "NO_OPEN_SESSION");
      const now = new Date();
      const minutes = Math.max(
        0,
        Math.round((now.getTime() - new Date(open.clockInAt).getTime()) / 60000)
      );
      return attRepo.closeSession({
        id: open.id,
        clockOutAt: now,
        minutesWorked: minutes,
      });
    },
  };
}
