export function isArray(toCheck: unknown, wanted_type: string): boolean {
  return (
    Array.isArray(toCheck) && toCheck.every((val) => typeof val === wanted_type)
  );
}
