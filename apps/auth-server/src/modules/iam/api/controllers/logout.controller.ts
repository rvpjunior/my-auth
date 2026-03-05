import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SessionService } from '@sessions/application/services/session.service';
import type { AuthRequest } from '@common/types/auth-request';

@Controller('auth')
export class LogoutController {
  constructor(private readonly sessionService: SessionService) {}
  @Get('logout')
  async logout(
    @Query('redirectTo') redirectTo: string,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const sid = req.cookies.sid;
    if (!sid) {
      return res.redirect(302, redirectTo);
    }

    await this.sessionService.deleteSession(sid);
    res.clearCookie('sid');
    return res.redirect(302, redirectTo);
  }
}
