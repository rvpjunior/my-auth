import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common';
import { AuthorizeRequestDto } from '../dto/authorize.request.dto';
import { AuthorizeUseCase } from '@oauth/application/use-cases/authorize.usecase';
import type { AuthRequest } from '@common/types/auth-request';
import type { Response } from 'express';
import { SESSION_READER } from '@sessions/tokens';
import type { SessionReaderPort } from '@sessions/application/ports/session-reader.port';

@Controller('oauth')
export class AuthorizeController {
  constructor(
    private readonly authorizeUseCase: AuthorizeUseCase,
    @Inject(SESSION_READER)
    private readonly sessionReader: SessionReaderPort,
  ) {}

  @Get('authorize')
  async authorize(
    @Query() query: AuthorizeRequestDto,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    const sid = req.cookies.sid;

    if (!sid) {
      return res.redirect(
        302,
        `/auth/login?redirectTo=${encodeURIComponent(req.originalUrl)}`,
      );
    }

    const session = this.sessionReader.findSessionById(sid);
    if (!session) {
      return res.redirect(
        302,
        `/auth/login?redirectTo=${encodeURIComponent(req.originalUrl)}`,
      );
    }

    const userId = session.userId;
    if (!userId) {
      return res.redirect(
        302,
        `/auth/login?redirectTo=${encodeURIComponent(req.originalUrl)}`,
      );
    }

    try {
      const result = await this.authorizeUseCase.execute(
        query.clientId,
        query.redirectUri,
        query.responseType,
        userId,
      );

      switch (result.type) {
        case 'redirect_to_client':
          return res.redirect(302, result.redirectTo);
        case 'invalid_client':
          return res.redirect(302, '/auth/login?error=invalid_client');
        case 'invalid_redirect_uri':
          return res.redirect(302, '/auth/login?error=invalid_redirect_uri');
        case 'invalid_response_type':
          return res.redirect(302, '/auth/login?error=invalid_response_type');
        case 'login_required':
          return res.redirect(
            302,
            `/auth/login?redirectTo=${encodeURIComponent(req.originalUrl)}`,
          );
      }
    } catch (error) {
      console.error(error);
      return res.redirect(
        302,
        `/auth/login?error=unknown_error&redirectTo=${encodeURIComponent(req.originalUrl)}`,
      );
    }
  }
}
