import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema } from '@travel-management-system/schemas';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
