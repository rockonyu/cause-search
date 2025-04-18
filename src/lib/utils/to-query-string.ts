export const toQueryString = <
  T extends Record<string, string | undefined | null>,
>(
  obj: T,
): string => {
  const cleaned = Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null && value !== ""),
  ) as Record<string, string>;

  const searchParams = new URLSearchParams(cleaned).toString();
  return searchParams ? `?${searchParams}` : "";
};

export default toQueryString;
