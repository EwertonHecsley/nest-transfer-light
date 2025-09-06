import { CreateUserCommonUseCase } from '@/application/users/common/useCase/Create';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { CreateUserCommonDto } from '../dto/create.dto';
import type { Response } from 'express';
import { UserCommonPresenter } from '../presenter/common.presenter';

@Controller('api/v1/common')
export class CreateUserCommonController {
  constructor(private readonly createService: CreateUserCommonUseCase) {}

  @Post()
  @HttpCode(201)
  async handler(
    @Body() dataUserCommon: CreateUserCommonDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.createService.execute(dataUserCommon);
    if (result.isLeft()) {
      const { message } = result.value;
      response.status(result.value.getStatus()).json({ message });
      return;
    }
    response.json({
      message: 'User created sucessfully.',
      user: UserCommonPresenter.toHTTP(result.value),
    });
  }
}
