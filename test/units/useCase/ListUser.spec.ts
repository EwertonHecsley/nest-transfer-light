import {
  FindAllParams,
  PaginatedResponse,
  UserCommonGateway,
} from '@/core/domain/users/common/gateway/UserCommonGateway';
import { UserCommon } from '@/core/domain/users/common/entity/UserCommon';
import { ListUserCommonUseCase } from '@/application/users/common/useCase/List';
import { Email } from '@/core/domain/users/common/objectValues/Email';
import { CPF } from '@/core/domain/users/common/objectValues/CPF';

describe('ListUserCommonUseCase', () => {
  let listUserCommonUseCase: ListUserCommonUseCase;
  let userCommonRepository: jest.Mocked<UserCommonGateway>;

  beforeEach(() => {
    userCommonRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findById: jest.fn(),
      list: jest.fn(),
    };
    listUserCommonUseCase = new ListUserCommonUseCase(userCommonRepository);
  });

  it('should list all common users successfully', async () => {
    const fakeEmail = Email.create('fake@email.com');
    const fakeCpf = CPF.create('12345678901');
    if (fakeEmail.isLeft()) throw new Error('Invalid email in test setup');
    if (fakeCpf.isLeft()) throw new Error('Invalid CPF in test setup');

    const params: FindAllParams = { page: 1, limit: 10 };
    const mockUsers = [
      UserCommon.create({
        fullName: 'John Doe',
        cpf: fakeCpf.value,
        email: fakeEmail.value,
        password: 'hashed_password',
        common: true,
        saldo: 0,
        createdAt: new Date(),
      }),
    ];
    const mockResponse: PaginatedResponse<UserCommon> = {
      data: mockUsers,
      total: 1,
      page: 1,
      limit: 10,
    };

    userCommonRepository.list.mockResolvedValue(mockResponse);

    const result = await listUserCommonUseCase.execute(params);

    expect(userCommonRepository.list).toHaveBeenCalledWith(params);
    expect(result).toEqual(mockResponse);
    expect(result.data[0]).toBeInstanceOf(UserCommon);
  });

  it('should return an empty list when no users are found', async () => {
    const params: FindAllParams = { page: 1, limit: 10 };
    const mockResponse: PaginatedResponse<UserCommon> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
    };

    userCommonRepository.list.mockResolvedValue(mockResponse);

    const result = await listUserCommonUseCase.execute(params);

    expect(userCommonRepository.list).toHaveBeenCalledWith(params);
    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});
