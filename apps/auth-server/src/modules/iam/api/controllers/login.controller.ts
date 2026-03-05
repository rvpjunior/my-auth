import {
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() body: PostLoginRequestDto, @Res() res: Response): void {
    try {
      const user = this.loginUseCase.execute(body.email, body.password);
      if (!user) {
        res.redirect(
          302,
          `/auth/login?error=invalid_credentials&redirectTo=${encodeURIComponent(body.redirectTo)}`,
        );
        return;
      }
      res.cookie('sid', '123', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      });
      return res.redirect(302, body.redirectTo);
    } catch (error) {
      console.error(error);
      return res.redirect(302, `/auth/login?error=unknown_error`);
    }
  }

  @Get('login')
  @Render('login')
  loginPage(@Query() query: GetLoginRequestDto): {
    redirectTo: string | undefined;
    errorMessage: string | null;
  } {
    const errorMessage = query.error
      ? query.error === 'invalid_credentials'
        ? 'Invalid credentials'
        : query.error === 'invalid_client'
          ? 'Invalid settings'
          : 'An unknown error occurred'
      : null;
    return { redirectTo: query.redirectTo, errorMessage };
  }
}
