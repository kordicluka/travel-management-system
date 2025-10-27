import { createZodDto } from 'nestjs-zod';
import {
  AirlineCreateApiSchema,
  AirlineUpdateApiSchema,
  AirlineModelSchema,
  AirlineQuerySchema,
  AirlineIncludeSchema,
} from '@travel-management-system/schemas';

export class AirlineDto extends createZodDto(AirlineModelSchema) {}

export class CreateAirlineDto extends createZodDto(AirlineCreateApiSchema) {}

export class UpdateAirlineDto extends createZodDto(AirlineUpdateApiSchema) {}

export class AirlineQueryDto extends createZodDto(AirlineQuerySchema) {}

export class AirlineIncludeDto extends createZodDto(AirlineIncludeSchema) {}
