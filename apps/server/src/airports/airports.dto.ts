import { createZodDto } from 'nestjs-zod';
import {
  AirportCreateApiSchema,
  AirportUpdateApiSchema,
  AirportModelSchema,
  AirportQuerySchema,
  AirportIncludeSchema, // 1. Import the new schema
} from '@travel-management-system/schemas';

export class AirportDto extends createZodDto(AirportModelSchema) {}

export class CreateAirportDto extends createZodDto(AirportCreateApiSchema) {}

export class UpdateAirportDto extends createZodDto(AirportUpdateApiSchema) {}

export class AirportQueryDto extends createZodDto(AirportQuerySchema) {}

// 2. Add the new DTO class
export class AirportIncludeDto extends createZodDto(AirportIncludeSchema) {}
