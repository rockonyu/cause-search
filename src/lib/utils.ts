import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL!;
  }

  return "";
};

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
