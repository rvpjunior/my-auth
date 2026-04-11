import { Controller, Get, Inject, Query, Req, Res } from '@nestjs/common';
import { AuthorizeRequestDto } from '../dto/authorize-request.dto';
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
      return this.redirecToLogin(res, req.originalUrl);
    }

    const session = this.sessionReader.findSessionById(sid);
    if (!session) {
      return this.redirecToLogin(res, req.originalUrl);
    }

    const userId = session.userId;
    if (!userId) {
      return this.redirecToLogin(res, req.originalUrl);
    }

    try {
      const result = await this.authorizeUseCase.execute(
        query.clientId,
        query.redirectUri,
        query.responseType,
        userId,
        query.scope,
      );

      switch (result.type) {
        case 'redirect_to_client':
          return res.redirect(302, result.redirectTo);
        case 'invalid_client':
          return this.redirecToLogin(res, req.originalUrl, 'invalid_client');
        case 'invalid_redirect_uri':
          return this.redirecToLogin(
            res,
            req.originalUrl,
            'invalid_redirect_uri',
          );
        case 'invalid_response_type':
          return this.redirecToLogin(
            res,
            req.originalUrl,
            'invalid_response_type',
          );
        case 'login_required':
          return this.redirecToLogin(res, req.originalUrl);
      }
    } catch (error) {
      console.error(error);
      return this.redirecToLogin(res, req.originalUrl, 'unknown_error');
    }
  }

  private redirecToLogin(res: Response, originalUrl: string, error?: string) {
    return res.redirect(
      302,
      `/auth/login?${error ? `error=${error}&` : ''}redirectTo=${encodeURIComponent(originalUrl)}`,
    );
  }
}
