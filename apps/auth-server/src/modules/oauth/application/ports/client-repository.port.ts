import type { Client } from '@oauth/domain/entities/client.entity';

export interface ClientRepositoryPort {
  findById(id: string): Client | null;
}
