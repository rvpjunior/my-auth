import { Injectable } from '@nestjs/common';
import type { PasswordHasherPort } from '@iam/application/ports/password-hasher.port';

@Injectable()
export class PasswordHasher implements PasswordHasherPort {
  verify(password: string, hashedPassword: string): boolean {
    if (password === 'test' && hashedPassword === 'test') {
      return true;
    }

    return false;
  }
}
