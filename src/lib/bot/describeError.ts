/** Error name and HTTP status only: an error message may quote the user's text, so it never reaches the logs. */
export function describeError(error: unknown): string {
  if (!(error instanceof Error)) return typeof error;
  const status = (error as { statusCode?: unknown; status?: unknown }).statusCode ?? (error as { status?: unknown }).status;
  return [error.name, typeof status === 'number' ? String(status) : undefined].filter(Boolean).join(' ');
}
