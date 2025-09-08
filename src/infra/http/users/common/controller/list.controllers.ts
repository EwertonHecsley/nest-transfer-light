import { ListUserCommonUseCase } from '@/application/users/common/useCase/List';
import { Controller, Get, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UserCommonPresenter } from '../presenter/common.presenter';

@Controller('api/v1/common')
export class ListUserCommonController {
  constructor(private readonly listService: ListUserCommonUseCase) {}

  @Get()
  @HttpCode(200)
  async handler(
    _page: string,
    _limit: string,
    @Res() response: Response,
  ): Promise<void> {
    const pageNumber = parseInt(_page) || 1;
    const limitNumber = parseInt(_limit) || 10;
    const result = await this.listService.execute({
      page: pageNumber,
      limit: limitNumber,
    });
    const { data, limit, page, total } = result;
    response.json({
      message: 'User common list successfully',
      data: data.map((user) => UserCommonPresenter.toHTTP(user)),
      limit,
      page,
      total,
    });
  }
}
