import { HashPasswordGateway } from '../../../src/core/domain/ports/HashPasswordGateway';
import { HashPasswordService } from '../../../src/infra/services/HashPassword.service';

describe('HashPasswordService', () => {
  let service: HashPasswordGateway;

  beforeEach(() => {
    service = new HashPasswordService();
  });

  // --- Teste 1: Hash de Senha ---
  it('should successfully hash a password', async () => {
    const password = 'mySecretPassword123';

    const hash = await service.hash(password);

    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$[0-9]{2}\$/);
  });

  // --- Teste 2: Comparação de Senha (Sucesso) ---
  it('should return true when comparing a password with its correct hash', async () => {
    const password = 'mySecretPassword123';

    // Gera o hash usando o próprio serviço
    const hash = await service.hash(password);

    const isMatch = await service.compare(password, hash);

    expect(isMatch).toBe(true);
  });

  // --- Teste 3: Comparação de Senha (Falha) ---
  it('should return false when comparing a password with an incorrect hash', async () => {
    const correctPassword = 'mySecretPassword123';
    const incorrectPassword = 'wrongPassword';

    const hash = await service.hash(correctPassword);

    const isMatch = await service.compare(incorrectPassword, hash);

    expect(isMatch).toBe(false);
  });
});
