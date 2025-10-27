import { Injectable } from '@nestjs/common';
import { Prisma, Airline } from '@travel-management-system/database';
import {
  CreateAirlineDto,
  UpdateAirlineDto,
  AirlineQueryDto,
} from './airlines.dto';
import {
  PaginatedResponse,
  PaginationMeta,
  AirlineIncludeRelation,
  AirlineIncludeQuery,
  AirlineResponse,
} from '@travel-management-system/schemas';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AirlinesService {
  constructor(private readonly databaseService: DatabaseService) {}

  private buildWhereInput(query: AirlineQueryDto): Prisma.AirlineWhereInput {
    const { search, baseCountry } = query;

    const where: Prisma.AirlineWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { baseCountry: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (baseCountry) {
      const countries = baseCountry.split(',').filter(Boolean);
      if (countries.length > 0) {
        where.baseCountry = { in: countries, mode: 'insensitive' };
      }
    }

    return where;
  }

  private buildAirlineInclude(
    relations: string[] | undefined,
  ): Prisma.AirlineInclude | undefined {
    if (!relations || relations.length === 0) {
      return undefined;
    }

    const include: Prisma.AirlineInclude = {};
    for (const relation of relations) {
      if (relation === 'servicedAirports') {
        include.servicedAirports = true;
      } else if (relation === 'operatedRoutes') {
        include.operatedRoutes = {
          include: {
            fromAirport: true,
            toAirport: true,
          },
        };
      }
    }
    return include;
  }

  async create(data: CreateAirlineDto): Promise<Airline> {
    const { servicedAirportIds, ...rest } = data;

    return await this.databaseService.airline.create({
      data: {
        ...rest,
        servicedAirports: {
          connect: servicedAirportIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll(
    query: AirlineQueryDto,
  ): Promise<PaginatedResponse<AirlineResponse>> {
    const { page, limit, sortBy, sortOrder, include } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where = this.buildWhereInput(query);

    const orderBy: Prisma.AirlineOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const includeObj = this.buildAirlineInclude(include);

    const findManyArgs: Prisma.AirlineFindManyArgs = {
      where,
      orderBy,
      take,
      skip,
      ...(includeObj && { include: includeObj }),
    };

    const [airlines, total] = await this.databaseService.$transaction([
      this.databaseService.airline.findMany(findManyArgs),
      this.databaseService.airline.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      total,
      page,
      limit,
      lastPage,
    };

    return { data: airlines, meta };
  }

  async findOne(
    where: Prisma.AirlineWhereUniqueInput,
    query?: AirlineIncludeQuery,
  ): Promise<AirlineResponse | null> {
    const includeObj = this.buildAirlineInclude(query?.include);

    return await this.databaseService.airline.findUnique({
      where,
      ...(includeObj && { include: includeObj }),
    });
  }

  async update(
    where: Prisma.AirlineWhereUniqueInput,
    data: UpdateAirlineDto,
  ): Promise<Airline> {
    const { servicedAirportIds, ...rest } = data;

    return await this.databaseService.airline.update({
      where,
      data: {
        ...rest,
        ...(servicedAirportIds && {
          servicedAirports: {
            set: servicedAirportIds.map((id) => ({ id })),
          },
        }),
      },
    });
  }

  async remove(where: Prisma.AirlineWhereUniqueInput): Promise<Airline> {
    return await this.databaseService.airline.delete({ where });
  }
}
