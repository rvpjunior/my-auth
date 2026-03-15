import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { TokenUseCase } from '@oauth/application/use-cases/token.usecase';
import type { PostTokenRequestDto } from '../dto/token-request.dto';
import type { SessionReaderPort } from '@sessions/application/ports/session-reader.port';
import { SESSION_READER } from '@sessions/tokens';
import type { AuthRequest } from '@common/types/auth-request';

@Controller('oauth')
export class TokenController {
  constructor(
    private readonly tokenUseCase: TokenUseCase,
    @Inject(SESSION_READER) private readonly sessionReader: SessionReaderPort,
  ) {}

  @Post('token')
  async token(@Body() body: PostTokenRequestDto, @Req() req: AuthRequest) {
    const sid = req.cookies.sid;

    if (!sid) {
      return {
        error: 'login_required',
      };
    }

    const session = this.sessionReader.findSessionById(sid);
    if (!session) {
      return {
        error: 'login_required',
      };
    }

    try {
      const result = await this.tokenUseCase.execute(body);
      return result;
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'unknown_error',
      };
    }
  }
}
