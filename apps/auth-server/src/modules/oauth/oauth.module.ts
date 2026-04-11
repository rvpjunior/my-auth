import { Module } from '@nestjs/common';
import { AuthorizeController } from '@oauth/api/controllers/authorize.controller';
import { AuthorizeUseCase } from '@oauth/application/use-cases/authorize.usecase';
import { LowdbClientRepository } from '@oauth/infrastructure/persistence/lowdb-client.repository';
import { LowdbAuthorizationCodeRepository } from '@oauth/infrastructure/persistence/lowdb-authorization-code.repository';
import {
  AUTHORIZATION_CODE_REPOSITORY,
  CLIENT_REPOSITORY,
  REFRESH_TOKEN_REPOSITORY,
  SIGNER,
  USER_REPOSITORY,
} from '@oauth/tokens';
import { LowdbModule } from '@infrastructure/persistence/lowdb/lowdb.module';
import { SessionsModule } from '@sessions/sessions.module';
import { JoseSigner } from './infrastructure/crypto/jose-signer';
import { TokenController } from './api/controllers/token.controller';
import { TokenUseCase } from './application/use-cases/token.usecase';
import { LowdbRefreshTokenRepository } from './infrastructure/persistence/lowdb-refresh-token.repository';
import { LowdbUserRepository } from './infrastructure/persistence/lowdb-user.repository';

@Module({
  controllers: [AuthorizeController, TokenController],
  imports: [LowdbModule, SessionsModule],
  providers: [
    AuthorizeUseCase,
    TokenUseCase,
    {
      provide: CLIENT_REPOSITORY,
      useClass: LowdbClientRepository,
    },
    {
      provide: AUTHORIZATION_CODE_REPOSITORY,
      useClass: LowdbAuthorizationCodeRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: LowdbRefreshTokenRepository,
    },
    {
      provide: SIGNER,
      useClass: JoseSigner,
    },
    {
      provide: USER_REPOSITORY,
      useClass: LowdbUserRepository,
    },
  ],
})
export class OauthModule {}
