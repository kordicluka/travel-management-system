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
import { AirportsService } from './airports.service';
import {
  CreateAirportDto,
  UpdateAirportDto,
  AirportQueryDto,
  AirportIncludeDto,
} from './airports.dto';
import type { PaginatedResponse, AirportResponse } from '@travel-management-system/schemas';
import type { Airport } from '@travel-management-system/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAirportDto: CreateAirportDto): Promise<Airport> {
    return await this.airportsService.create(createAirportDto);
  }

  @Get()
  async findAll(
    @Query() queryDto: AirportQueryDto,
  ): Promise<PaginatedResponse<AirportResponse>> {
    return await this.airportsService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() query: AirportIncludeDto,
  ): Promise<AirportResponse | null> {
    return await this.airportsService.findOne({ id }, query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAirportDto: UpdateAirportDto,
  ): Promise<Airport> {
    return await this.airportsService.update({ id }, updateAirportDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<Airport> {
    return await this.airportsService.remove({ id });
  }
}
