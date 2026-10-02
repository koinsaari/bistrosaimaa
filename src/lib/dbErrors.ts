// Drizzle wraps driver errors, so the Postgres code can sit on the error or on its cause.
function hasPgCode(err: unknown, code: string): boolean {
  const codeOf = (e: unknown) => (typeof e === 'object' && e !== null ? (e as { code?: unknown }).code : undefined);
  const cause = typeof err === 'object' && err !== null ? (err as { cause?: unknown }).cause : undefined;
  return codeOf(err) === code || codeOf(cause) === code;
}

export const isUniqueViolation = (err: unknown) => hasPgCode(err, '23505');
export const isForeignKeyViolation = (err: unknown) => hasPgCode(err, '23503');
