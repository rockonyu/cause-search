import getBaseUrl from "./get-base-url";
import { toQueryString } from "./to-query-string";

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit & {
    params: Record<string, string | null | undefined>;
  } = { params: {} },
): Promise<T> => {
  const { params, ...restOptions } = options;

  const res = await fetch(
    `${getBaseUrl()}${endpoint}${toQueryString(params)}`,
    {
      headers: { "Content-Type": "application/json" },
      ...restOptions,
    },
  );

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};
