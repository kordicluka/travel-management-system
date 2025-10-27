import { Injectable } from '@nestjs/common';
import { Prisma, Airport } from '@travel-management-system/database';
import {
  CreateAirportDto,
  UpdateAirportDto,
  AirportQueryDto,
} from './airports.dto';
import {
  PaginatedResponse,
  PaginationMeta,
  AirportIncludeQuery,
  AirportResponse,
} from '@travel-management-system/schemas';
import { DatabaseService } from '../database/database.service';
import { buildPrismaInclude } from '../common/utils/prisma.utils';

@Injectable()
export class AirportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateAirportDto): Promise<Airport> {
    return await this.databaseService.airport.create({ data });
  }

  async findAll(
    query: AirportQueryDto,
  ): Promise<PaginatedResponse<AirportResponse>> {
    const { page, limit, sortBy, sortOrder, include } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where = this.buildWhereInput(query);

    const includeObj = buildPrismaInclude(include);

    const orderBy: Prisma.AirportOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const findManyArgs: Prisma.AirportFindManyArgs = {
      where,
      orderBy,
      take,
      skip,
      ...(includeObj && { include: includeObj }),
    };

    const [airports, total] = await this.databaseService.$transaction([
      this.databaseService.airport.findMany(findManyArgs),
      this.databaseService.airport.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      lastPage,
    };

    return { data: airports, meta };
  }

  async findOne(
    where: Prisma.AirportWhereUniqueInput,
    query?: AirportIncludeQuery,
  ): Promise<AirportResponse | null> {
    const includeObj = this.buildAirportInclude(query?.include);

    return await this.databaseService.airport.findUnique({
      where,
      ...(includeObj && { include: includeObj }),
    });
  }

  async update(
    where: Prisma.AirportWhereUniqueInput,
    data: UpdateAirportDto,
  ): Promise<Airport> {
    return await this.databaseService.airport.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.AirportWhereUniqueInput): Promise<Airport> {
    return await this.databaseService.airport.delete({ where });
  }

  private buildWhereInput(query: AirportQueryDto): Prisma.AirportWhereInput {
    const { search, country, code } = query;

    const where: Prisma.AirportWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (code) {
      where.code = { contains: code, mode: 'insensitive' };
    }

    if (country && country.length > 0) {
      where.country = { in: country };
    }

    return where;
  }

  private buildAirportInclude(
    relations: string[] | undefined,
  ): Prisma.AirportInclude | undefined {
    if (!relations || relations.length === 0) {
      return undefined;
    }

    const include: Prisma.AirportInclude = {};
    for (const relation of relations) {
      if (relation === 'routesFrom') {
        include.routesFrom = {
          include: {
            toAirport: true,
            airline: true,
            fromAirport: true,
          },
        };
      } else if (relation === 'routesTo') {
        include.routesTo = {
          include: {
            fromAirport: true,
            airline: true,
            toAirport: true,
          },
        };
      }
    }
    return include;
  }
}
