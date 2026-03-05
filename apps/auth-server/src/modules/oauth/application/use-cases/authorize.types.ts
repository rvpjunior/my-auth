export type AuthorizeResponse =
  | { type: 'login_required' }
  | { type: 'invalid_client' }
  | { type: 'invalid_redirect_uri' }
  | { type: 'invalid_response_type' }
  | { type: 'redirect_to_client'; redirectTo: string };
