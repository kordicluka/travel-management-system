import { z, ZodRawShape } from "zod";

/**
 * Pagination metadata schema
 */
export const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  lastPage: z.number().int().positive(),
});

/**
 * Generic paginated response schema
 * @template T - The type of data being paginated
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) => {
  return z.object({
    data: z.array(dataSchema),
    meta: PaginationMetaSchema,
  });
};

// --- NEW QUERY SCHEMA FACTORY ---

/**
 * Base fields common to all query schemas
 */
const baseQueryFields = {
  page: z.coerce.number().int().positive().default(1).optional(),
  limit: z.coerce.number().int().positive().max(10000).default(10).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc").optional(),
  search: z.string().optional(),
};

/**
 * Helper to create the 'include' schema part
 */
const createIncludeSchema = (relations: readonly [string, ...string[]]) => {
  return z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          return val.split(",").filter(Boolean);
        }
        return val;
      },
      z.array(z.enum(relations))
    )
    .optional();
};

/**
 * Creates a standard query schema for an entity.
 *
 * @param sortableFields - A `const` array of valid sort fields.
 * @param defaultSortBy - The default field to sort by.
 * @param includableRelations - A `const` array of valid include relations.
 * @param specificFilters - A ZodRawShape object of entity-specific filters.
 */
export const createQuerySchema = <
  const TSort extends readonly [string, ...string[]],
  const TInclude extends readonly [string, ...string[]],
  TFilters extends ZodRawShape,
>(
  sortableFields: TSort,
  defaultSortBy: TSort[number], // Type-safe default
  includableRelations: TInclude,
  specificFilters: TFilters
) => {
  return z.object({
    ...baseQueryFields,
    sortBy: z.enum(sortableFields).default(defaultSortBy).optional(),
    include: createIncludeSchema(includableRelations),
    ...specificFilters, // Merge entity-specific filters
  });
};

// Export types
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
