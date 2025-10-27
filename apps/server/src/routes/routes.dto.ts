import { createZodDto } from 'nestjs-zod';
import {
  RouteCreateApiSchema,
  RouteUpdateApiSchema,
  RouteModelSchema,
  RouteQuerySchema,
  RouteIncludeSchema,
} from '@travel-management-system/schemas';

export class RouteDto extends createZodDto(RouteModelSchema) {}

export class CreateRouteDto extends createZodDto(RouteCreateApiSchema) {}

export class UpdateRouteDto extends createZodDto(RouteUpdateApiSchema) {}

export class RouteQueryDto extends createZodDto(RouteQuerySchema) {}

export class RouteIncludeDto extends createZodDto(RouteIncludeSchema) {}
