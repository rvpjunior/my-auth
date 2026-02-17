import { Body, Controller, Post } from '@nestjs/common';
import { RegisterRequestDto } from './dtos/register.request.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() requestDto: RegisterRequestDto) {
    return { ok: true, email: requestDto.email };
  }
}
