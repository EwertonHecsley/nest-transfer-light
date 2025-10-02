import { ListAllUserClientUseCase } from '../../../../src/application/userClient/useCase/List';
import {
  FindAllParams,
  PaginatedResponse,
  UserClientGateway,
} from '../../../../src/core/domain/ports/UserClientGateway';
import { UserClient } from '../../../../src/core/domain/userClient/entity/UserClient';

describe('ListAllUserClientUseCase', () => {
  let useCase: ListAllUserClientUseCase;
  let mockUserClientGateway: jest.Mocked<UserClientGateway>;

  beforeEach(() => {
    mockUserClientGateway = {
      listAll: jest.fn(),
      create: jest.fn(),
      findByCpf: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new ListAllUserClientUseCase(mockUserClientGateway);
  });

  it('should call the gateway and return a paginated list of user clients', async () => {
    const params: FindAllParams = { page: 1, limit: 10 };
    const mockUsers: UserClient[] = [{} as UserClient, {} as UserClient];
    const mockResponse: PaginatedResponse<UserClient> = {
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
    };

    mockUserClientGateway.listAll.mockResolvedValue(mockResponse);

    const result = await useCase.execute(params);

    expect(result).toEqual(mockResponse);
    expect(mockUserClientGateway.listAll).toHaveBeenCalledTimes(1);
    expect(mockUserClientGateway.listAll).toHaveBeenCalledWith(params);
  });
});
