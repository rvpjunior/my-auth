import { Module } from '@nestjs/common';
import { IamModule } from './modules/iam/iam.module';
import { OauthModule } from './modules/oauth/oauth.module';

@Module({
  imports: [IamModule, OauthModule],
})
export class AppModule {}
