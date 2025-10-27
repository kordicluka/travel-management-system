import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  password: z.string(),
  refreshToken: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserPublicSchema = UserSchema.omit({
  password: true,
  refreshToken: true,
});

export const UpdateUserSchema = z
  .object({
    email: z.string().email(),
    refreshToken: z.string().nullable(),
  })
  .partial();

export type User = z.infer<typeof UserSchema>;
export type UserPublic = z.infer<typeof UserPublicSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
