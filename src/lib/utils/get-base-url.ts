export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL!;
  }

  return "";
};

export default getBaseUrl;
