import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import { ListAllUserClientUseCase } from 'application/userClient/useCase/List';
import type { Response } from 'express';

@Controller('userClient')
export class ListAllUserClientController {
  constructor(
    private readonly listAllUserClientUseCase: ListAllUserClientUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handler(
    _page: string,
    _limit: string,
    @Res() response: Response,
  ): Promise<void> {
    const pageNumber = parseInt(_page) || 1;
    const limitNumber = parseInt(_limit) || 10;

    const result = await this.listAllUserClientUseCase.execute({
      page: pageNumber,
      limit: limitNumber,
    });

    const { data, total, limit, page } = result;
    response.json({
      message: 'User clients list successfully',
      data,
      limit,
      page,
      total,
    });
  }
}
