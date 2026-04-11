export class AuthorizeRequestDto {
  clientId: string;
  redirectUri: string;
  responseType: string;
  scope?: string;
}
