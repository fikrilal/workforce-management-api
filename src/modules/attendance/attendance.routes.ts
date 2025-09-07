import { Router } from "express";
import { body, query } from "express-validator";
import { authMiddleware } from "../../shared/middleware/auth";
import { validate } from "../../shared/middleware/validate";
import { CheckinMethods } from "../../domain/attendance/checkin-method";
import { attendanceController } from "./attendance.controller";

export const attendanceRouter = Router();

attendanceRouter.use(authMiddleware);

attendanceRouter.post(
  "/clock-in",
  validate([
    body("note").optional().isString(),
    body("method").optional().isIn(Array.from(CheckinMethods)),
  ]),
  attendanceController.clockIn
);

attendanceRouter.post("/clock-out", attendanceController.clockOut);

attendanceRouter.get(
  "/",
  validate([
    query("from").optional().isISO8601(),
    query("to").optional().isISO8601(),
    query("month").optional().matches(/^\d{4}-\d{2}$/),
    query("year").optional().isInt({ min: 1970, max: 3000 }),
    query("method").optional().isIn(Array.from(CheckinMethods)),
    query("status").optional().isIn(["open", "closed"]),
    query("page").optional().isInt({ min: 1 }),
    query("pageSize").optional().isInt({ min: 1, max: 100 }),
  ]),
  attendanceController.list
);
