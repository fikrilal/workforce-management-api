import { userRepositoryPrisma } from '../infrastructure/prisma/repositories/user.repository.prisma';
import { attendanceRepositoryPrisma } from '../infrastructure/prisma/repositories/attendance.repository.prisma';
import { leaveRepositoryPrisma } from '../infrastructure/prisma/repositories/leave.repository.prisma';
import { payslipRepositoryPrisma } from '../infrastructure/prisma/repositories/payslip.repository.prisma';
import { makeRegisterUser } from './auth/register-user.usecase';
import { makeLoginUser } from './auth/login-user.usecase';
import { makeGetMe } from './auth/get-me.usecase';
import { makeIssueRefreshToken } from './auth/issue-refresh-token.usecase';
import { makeRefreshSession } from './auth/refresh-session.usecase';
import { makeLogout } from './auth/logout.usecase';
import { makeClockIn } from './attendance/clock-in.usecase';
import { makeClockOut } from './attendance/clock-out.usecase';
import { makeListSessions } from './attendance/list-sessions.usecase';
import { makeCreateLeave } from './leave/create-leave.usecase';
import { makeCancelLeave } from './leave/cancel-leave.usecase';
import { makeListLeaves } from './leave/list-leaves.usecase';
import { makeListPayslips } from './payslip/list-payslips.usecase';
import { makeGetPayslip } from './payslip/get-payslip.usecase';
import { refreshTokenRepositoryPrisma } from '../infrastructure/prisma/repositories/refresh-token.repository.prisma';

// simple composition root for wiring dependencies
const userRepo = userRepositoryPrisma;
const attendanceRepo = attendanceRepositoryPrisma;
const leaveRepo = leaveRepositoryPrisma;
const payslipRepo = payslipRepositoryPrisma;
const refreshTokenRepo = refreshTokenRepositoryPrisma;

export const useCases = {
  registerUser: makeRegisterUser(userRepo),
  loginUser: makeLoginUser(userRepo),
  getMe: makeGetMe(userRepo),
  issueRefresh: makeIssueRefreshToken(refreshTokenRepo),
  refreshSession: makeRefreshSession(refreshTokenRepo, userRepo),
  logout: makeLogout(refreshTokenRepo),
  clockIn: makeClockIn(attendanceRepo),
  clockOut: makeClockOut(attendanceRepo),
  listAttendance: makeListSessions(attendanceRepo),
  createLeave: makeCreateLeave(leaveRepo),
  cancelLeave: makeCancelLeave(leaveRepo),
  listLeaves: makeListLeaves(leaveRepo),
  listPayslips: makeListPayslips(payslipRepo),
  getPayslip: makeGetPayslip(payslipRepo)
};

export const ports = {
  userRepo,
  attendanceRepo,
  leaveRepo,
  payslipRepo,
  refreshTokenRepo
};
