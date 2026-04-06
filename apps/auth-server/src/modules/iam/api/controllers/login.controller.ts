import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  PostLoginRequestDto,
  GetLoginRequestDto,
} from '../dto/login.request.dto';
import { LoginUseCase } from 'src/modules/iam/application/use-cases/login.usecase';
import type { SessionWriterPort } from '@sessions/application/ports/session-writer.port';
import { SESSION_WRITER } from '@sessions/tokens';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    @Inject(SESSION_WRITER)
    private readonly sessionWriter: SessionWriterPort,
  ) {}

  @Post('login')
  async login(
    @Body() body: PostLoginRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = this.loginUseCase.execute(body.email, body.password);
      if (!user) {
        res.redirect(
          302,
          `/auth/login?error=invalid_credentials&redirectTo=${encodeURIComponent(body.redirectTo)}`,
        );
        return;
      }

      const session = await this.sessionWriter.createSession(user.id);
      res.cookie('sid', session.id, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return res.redirect(302, body.redirectTo);
    } catch (error) {
      console.error(error);
      return res.redirect(
        302,
        `/auth/login?error=unknown_error&redirectTo=${encodeURIComponent(body.redirectTo)}`,
      );
    }
  }

  @Get('login')
  @Render('login')
  loginPage(@Query() query: GetLoginRequestDto): {
    redirectTo: string | undefined;
    errorMessage: string | null;
  } {
    let errorMessage: string | null = null;
    if (query.error) {
      switch (query.error) {
        case 'invalid_credentials':
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 'invalid_client':
          errorMessage = 'Invalid settings. The client is not registered.';
          break;
        case 'invalid_redirect_uri':
          errorMessage =
            'Invalid settings. The redirect URI is not registered.';
          break;
        case 'invalid_response_type':
          errorMessage =
            'Invalid settings. The response type is not supported.';
          break;
        case 'unknown_error':
        default:
          errorMessage = 'An unknown error occurred. Please try again later.';
          break;
      }
    }
    return { redirectTo: query.redirectTo, errorMessage };
  }
}
