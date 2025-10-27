import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';

@Module({
  imports: [],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
