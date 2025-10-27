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
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto, RouteQueryDto, RouteIncludeDto } from './routes.dto';
import type { PaginatedResponse, RouteResponse } from '@travel-management-system/schemas';
import type { Route } from '@travel-management-system/database';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRouteDto: CreateRouteDto): Promise<Route> {
    return await this.routesService.create(createRouteDto);
  }

  @Get()
  async findAll(@Query() queryDto: RouteQueryDto): Promise<PaginatedResponse<RouteResponse>> {
    return await this.routesService.findAll(queryDto);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() query: RouteIncludeDto,
  ): Promise<RouteResponse | null> {
    return await this.routesService.findOne({ id }, query);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRouteDto: UpdateRouteDto,
  ): Promise<Route> {
    return await this.routesService.update({ id }, updateRouteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<Route> {
    return await this.routesService.remove({ id });
  }
}
