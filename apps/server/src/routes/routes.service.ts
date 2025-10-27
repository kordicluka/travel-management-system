import { Injectable } from '@nestjs/common';
import { Prisma, Route } from '@travel-management-system/database';
import { CreateRouteDto, UpdateRouteDto, RouteQueryDto } from './routes.dto';
import {
  PaginatedResponse,
  PaginationMeta,
  RouteIncludeQuery,
  RouteResponse,
} from '@travel-management-system/schemas';
import { DatabaseService } from '../database/database.service';
import { buildPrismaInclude } from 'src/common/utils/prisma.utils';
import { calculateDistance } from 'src/common/utils/distance.utils';

@Injectable()
export class RoutesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateRouteDto): Promise<Route> {
    // Always calculate distance using Haversine formula
    const distanceKm = await this.calculateDistanceForAirports(
      data.fromAirportId,
      data.toAirportId,
    );

    return await this.databaseService.route.create({
      data: {
        ...data,
        distanceKm,
      },
    });
  }

  async findAll(
    query: RouteQueryDto,
  ): Promise<PaginatedResponse<RouteResponse>> {
    const { page, limit, sortBy, sortOrder, include } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    // Build where clause from query DTO
    const where = this.buildWhereInput(query);

    const orderBy: Prisma.RouteOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const includeObj = buildPrismaInclude(query.include);

    const findManyArgs: Prisma.RouteFindManyArgs = {
      where,
      orderBy,
      take,
      skip,
      ...(includeObj && { include: includeObj }),
    };

    const [routes, total] = await this.databaseService.$transaction([
      this.databaseService.route.findMany(findManyArgs),
      this.databaseService.route.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      lastPage,
    };

    return { data: routes, meta };
  }

  async findOne(
    where: Prisma.RouteWhereUniqueInput,
    query?: RouteIncludeQuery,
  ): Promise<RouteResponse | null> {
    const includeObj = buildPrismaInclude(query.include);

    return await this.databaseService.route.findUnique({
      where,
      ...(includeObj && { include: includeObj }),
    });
  }

  async update(
    where: Prisma.RouteWhereUniqueInput,
    data: UpdateRouteDto,
  ): Promise<Route> {
    // Get current route to determine airport IDs
    const existingRoute = await this.databaseService.route.findUnique({
      where,
    });

    if (!existingRoute) {
      throw new Error('Route not found');
    }

    // Determine which airports to use for distance calculation
    const fromAirportId = data.fromAirportId || existingRoute.fromAirportId;
    const toAirportId = data.toAirportId || existingRoute.toAirportId;

    // Always recalculate distance using Haversine formula
    const distanceKm = await this.calculateDistanceForAirports(
      fromAirportId,
      toAirportId,
    );

    return await this.databaseService.route.update({
      where,
      data: {
        ...data,
        distanceKm,
      },
    });
  }

  async remove(where: Prisma.RouteWhereUniqueInput): Promise<Route> {
    return await this.databaseService.route.delete({ where });
  }

  private buildWhereInput(query: RouteQueryDto): Prisma.RouteWhereInput {
    const { search, fromAirportId, toAirportId, airlineId } = query;

    const where: Prisma.RouteWhereInput = {};

    if (search) {
      // Search doesn't make much sense for routes, but keep for consistency
      where.OR = [
        { fromAirport: { name: { contains: search, mode: 'insensitive' } } },
        { toAirport: { name: { contains: search, mode: 'insensitive' } } },
        { airline: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (fromAirportId) {
      where.fromAirportId = fromAirportId;
    }

    if (toAirportId) {
      where.toAirportId = toAirportId;
    }

    if (airlineId) {
      const airlineIds = airlineId.split(',').filter(Boolean);
      if (airlineIds.length > 0) {
        where.airlineId = { in: airlineIds };
      }
    }

    return where;
  }

  /**
   * Calculate distance between two airports using Haversine formula.
   * This is always calculated automatically and cannot be overridden by users.
   */
  private async calculateDistanceForAirports(
    fromAirportId: string,
    toAirportId: string,
  ): Promise<number> {
    // Fetch both airports to get their coordinates
    const [fromAirport, toAirport] = await Promise.all([
      this.databaseService.airport.findUnique({
        where: { id: fromAirportId },
      }),
      this.databaseService.airport.findUnique({
        where: { id: toAirportId },
      }),
    ]);

    // If we can't find both airports, throw an error
    if (!fromAirport || !toAirport) {
      throw new Error('Could not find one or both airports');
    }

    // Calculate distance using Haversine formula
    return calculateDistance(
      fromAirport.latitude,
      fromAirport.longitude,
      toAirport.latitude,
      toAirport.longitude,
    );
  }
}
