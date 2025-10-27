import { createZodDto } from 'nestjs-zod';
import { RegisterSchema, LoginSchema } from '@travel-management-system/schemas'; // Adjust package name if needed

export class RegisterDto extends createZodDto(RegisterSchema) {}

export class LoginDto extends createZodDto(LoginSchema) {}
