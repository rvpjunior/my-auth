import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { TokenUseCase } from '@oauth/application/use-cases/token.usecase';
import type { PostTokenRequestDto } from '../dto/token-request.dto';
import type { SessionReaderPort } from '@sessions/application/ports/session-reader.port';
import { SESSION_READER } from '@sessions/tokens';
import type { AuthRequest } from '@common/types/auth-request';
import type { Response } from 'express';

@Controller('oauth')
export class TokenController {
  constructor(
    private readonly tokenUseCase: TokenUseCase,
    @Inject(SESSION_READER) private readonly sessionReader: SessionReaderPort,
  ) {}

  @Post('token')
  async token(
    @Body() body: PostTokenRequestDto,
    @Req() req: AuthRequest,
    @Res() res: Response,
  ) {
    const sid = req.cookies.sid;

    if (!sid) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    const session = this.sessionReader.findSessionById(sid);
    if (!session) {
      return res.status(401).send({
        error: 'Unauthorized',
      });
    }

    try {
      const result = await this.tokenUseCase.execute(body);
      return res.json(result);
    } catch (error) {
      return res.status(400).send({
        error: error instanceof Error ? error.message : 'Bad Request',
      });
    }
  }
}
