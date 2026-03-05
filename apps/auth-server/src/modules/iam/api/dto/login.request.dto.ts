export class PostLoginRequestDto {
  email: string;
  password: string;
  redirectTo: string;
}

export class GetLoginRequestDto {
  redirectTo?: string;
  error?: string;
}
