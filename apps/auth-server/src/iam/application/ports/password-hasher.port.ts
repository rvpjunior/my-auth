export interface PasswordHasherPort {
  verify(password: string, hashedPassword: string): boolean;
}
