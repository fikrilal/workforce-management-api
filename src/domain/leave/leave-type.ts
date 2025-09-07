export const LeaveTypes = ['ANNUAL', 'SICK', 'UNPAID', 'OTHER'] as const;
export type LeaveType = typeof LeaveTypes[number];

