import type { AttendanceRepository } from "../../domain/attendance/attendance.repository";

export type ListSessionsInput = { userId: string; from?: Date; to?: Date };

export function makeListSessions(attRepo: AttendanceRepository) {
  return {
    async execute(input: ListSessionsInput) {
      return attRepo.listByUser(input);
    },
  };
}
