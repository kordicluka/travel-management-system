import { Module } from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import { AirlinesController } from './airlines.controller';

@Module({
  imports: [],
  controllers: [AirlinesController],
  providers: [AirlinesService],
})
export class AirlinesModule {}
