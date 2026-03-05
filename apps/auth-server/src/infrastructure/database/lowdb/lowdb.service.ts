import { JSONFile } from 'lowdb/node';
import { DBSchema } from './db.schema';
import { Low } from 'lowdb';
import { Injectable } from '@nestjs/common';
import path from 'node:path';

@Injectable()
export class LowdbService {
  private db: Low<DBSchema>;
  constructor() {}

  async init() {
    // Use project root so data persists across rebuilds (dist/ is wiped on each build)
    const dbPath = path.join(process.cwd(), 'db.json');
    const adapter = new JSONFile<DBSchema>(dbPath);

    this.db = new Low(adapter, {
      users: [],
      clients: [],
      authorizationCodes: [],
    } satisfies DBSchema);

    await this.db.read();
  }

  get data() {
    if (!this.db) {
      throw new Error(
        'Database not initialized. Ensure DatabaseModule is imported and onModuleInit has run.',
      );
    }
    return this.db.data;
  }

  async write() {
    await this.db.write();
  }
}
