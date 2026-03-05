import { Module, OnModuleInit } from '@nestjs/common';
import { LowdbService } from './lowdb.service';

@Module({
  providers: [LowdbService],
  exports: [LowdbService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly db: LowdbService) {}

  async onModuleInit() {
    await this.db.init();
  }
}
