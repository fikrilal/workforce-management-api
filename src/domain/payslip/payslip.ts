export type Payslip = {
  id: string;
  userId: string;
  year: number;
  month: number; // 1..12
  currency: string;
  gross: any; // Decimal from Prisma maps to any in JS; use string in DTOs if needed
  net: any;
  items: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

