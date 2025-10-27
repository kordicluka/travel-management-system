// apps/server/src/common/utils/prisma.utils.ts

/**
 * Creates a Prisma 'include' object from an array of relation names.
 *
 * @example
 * // returns { users: true, posts: true }
 * buildPrismaInclude(['users', 'posts'])
 *
 * @example
 * // returns undefined
 * buildPrismaInclude(undefined)
 */
export function buildPrismaInclude<T extends string>(
  relations: T[] | undefined,
): Record<T, true> | undefined {
  if (!relations || relations.length === 0) {
    return undefined;
  }

  const includeObj = {} as Record<T, true>;
  for (const relation of relations) {
    includeObj[relation] = true;
  }
  return includeObj;
}
