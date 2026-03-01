import { Module } from '@nestjs/common';
import { LoginController } from './api/controllers/login.controller';

@Module({
  controllers: [LoginController],
})
export class IamModule {}
