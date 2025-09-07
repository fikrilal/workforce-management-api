export const LeaveStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;
export type LeaveStatus = typeof LeaveStatuses[number];

