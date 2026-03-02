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
import { LoginRequestDto } from '../dto/login.request.dto';
import { LoginUseCase } from '@iam/application/use-cases/login.usecase';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() body: LoginRequestDto, @Res() res: Response): void {
    try {
      const user = this.loginUseCase.execute(body.email, body.password);
      if (!user) {
        res.redirect(
          302,
          `/auth/login?error=invalid_credentials&returnTo=${body.returnTo}`,
        );
        return;
      }
      res.redirect(302, `${body.returnTo}?access_token=test`);
    } catch {
      res.redirect(
        302,
        `/auth/login?error=invalid_credentials&returnTo=${body.returnTo}`,
      );
    }
  }

  @Get('login')
  @Render('login')
  loginPage(
    @Query('returnTo') returnTo?: string,
    @Query('error') error?: string,
  ) {
    const errorMessage = error
      ? error === 'invalid_credentials'
        ? 'Invalid credentials'
        : error === 'invalid_settings'
          ? 'Invalid settings'
          : 'An unknown error occurred'
      : null;
    return { returnTo, errorMessage };
  }
}
