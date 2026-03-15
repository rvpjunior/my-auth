import { Body, Controller, Post } from '@nestjs/common';
import { TokenUseCase } from '@oauth/application/use-cases/token.usecase';
import type { PostTokenRequestDto } from '../dto/token-request.dto';

@Controller('oauth')
export class TokenController {
  constructor(private readonly tokenUseCase: TokenUseCase) {}

  @Post('token')
  async token(@Body() body: PostTokenRequestDto) {
    try {
      const result = await this.tokenUseCase.execute(
        body.grant_type,
        body.code,
        body.redirect_uri,
      );

      return result;
    } catch (error) {
      console.error(error);
      return {
        error: 'internal_server_error',
        error_description: 'Internal server error',
      };
    }
  }
}
