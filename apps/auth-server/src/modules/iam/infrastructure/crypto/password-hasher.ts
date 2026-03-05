import { Injectable } from '@nestjs/common';
import type { PasswordHasherPort } from 'src/modules/iam/application/ports/password-hasher.port';

@Injectable()
export class PasswordHasher implements PasswordHasherPort {
  verify(password: string, hashedPassword: string): boolean {
    return password === hashedPassword;
  }
}
