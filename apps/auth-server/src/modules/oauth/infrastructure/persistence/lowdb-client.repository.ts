import { Injectable } from '@nestjs/common';
import { ClientRepositoryPort } from '@oauth/application/ports/client-repository.port';
import { Client } from '@oauth/domain/entities/client.entity';
import { LowdbService } from 'src/infrastructure/persistence/lowdb/lowdb.service';

@Injectable()
export class LowdbClientRepository implements ClientRepositoryPort {
  constructor(private readonly db: LowdbService) {}

  findById(id: string): Client | null {
    const client = this.db.data.clients.find((client) => client.id === id);
    if (!client) {
      return null;
    }
    return new Client(client.id, client.redirectUris);
  }
}
