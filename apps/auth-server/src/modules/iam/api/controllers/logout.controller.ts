import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { AuthRequest } from '@common/types/auth-request';
import { SESSION_WRITER } from '@sessions/tokens';
import type { SessionWriterPort } from '@sessions/application/ports/session-writer.port';

@Controller('auth')
export class LogoutController {
  constructor(
    @Inject(SESSION_WRITER)
    private readonly sessionWriter: SessionWriterPort,
  ) {}
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

    await this.sessionWriter.deleteSession(sid);
    res.clearCookie('sid');
    return res.redirect(302, redirectTo);
  }
}
