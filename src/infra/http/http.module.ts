import { Module } from '@nestjs/common';
import { UserCommonModule } from './users/common/common.module';

@Module({
  imports: [UserCommonModule],
  exports: [UserCommonModule],
})
export class HttpModule {}
