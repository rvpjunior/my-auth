export class Client {
  constructor(
    public readonly id: string,
    public readonly redirectUris: string[],
  ) {}
}
