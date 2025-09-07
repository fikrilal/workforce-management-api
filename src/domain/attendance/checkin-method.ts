export const CheckinMethods = ["WEB", "MOBILE", "KIOSK"] as const;
export type CheckinMethod = (typeof CheckinMethods)[number];
