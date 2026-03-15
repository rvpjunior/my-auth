export interface PostTokenRequestDto {
  grant_type: 'authorization_code';
  code: string;
  redirect_uri: string;
}
