export abstract class HashPasswordGateway {
  abstract hash(password: string): Promise<string>;
  abstract compare(passwod: string, hash: string): Promise<boolean>;
}
