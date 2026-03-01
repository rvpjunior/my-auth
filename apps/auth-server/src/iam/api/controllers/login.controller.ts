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

@Controller('auth')
export class LoginController {
  @Post('login')
  login(@Body() body: LoginRequestDto, @Res() res: Response): void {
    if (body.email === 'test@test.com' && body.password === 'test') {
      if (!body.returnTo) {
        res.redirect(302, '/auth/login?error=invalid_settings');
        return;
      }
      res.redirect(302, body.returnTo);
      return;
    }

    res.redirect(
      302,
      `/auth/login?error=invalid_credentials&returnTo=${body.returnTo}`,
    );
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
