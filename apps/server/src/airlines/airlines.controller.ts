import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AirlinesService } from './airlines.service';
import {
  CreateAirlineDto,
  UpdateAirlineDto,
  AirlineQueryDto,
  AirlineIncludeDto,
} from './airlines.dto';
import type { PaginatedResponse, AirlineResponse } from '@travel-management-system/schemas';
import type { Airline } from '@travel-management-system/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('airlines')
export class AirlinesController {
  constructor(private readonly airlinesService: AirlinesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAirlineDto: CreateAirlineDto): Promise<Airline> {
    return await this.airlinesService.create(createAirlineDto);
  }

  @Get()
  async findAll(
    @Query() queryDto: AirlineQueryDto,
  ): Promise<PaginatedResponse<AirlineResponse>> {
    return await this.airlinesService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() query: AirlineIncludeDto,
  ): Promise<AirlineResponse | null> {
    return await this.airlinesService.findOne({ id }, query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAirlineDto: UpdateAirlineDto,
  ): Promise<Airline> {
    return await this.airlinesService.update({ id }, updateAirlineDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<Airline> {
    return await this.airlinesService.remove({ id });
  }
}
