import { prisma } from "@/lib/prisma";

type FetchOrganizationsParams = {
  limit: number;
  cursor?: Date;
  keyword?: string;
};

export async function fetchOrganizations({
  limit,
  cursor,
  keyword = "",
}: FetchOrganizationsParams) {
  return await prisma.organization.findMany({
    take: limit,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: {
      ...(cursor && {
        AND: [{ createdAt: { lt: cursor } }],
      }),
      ...(keyword && {
        name: { contains: keyword, mode: "insensitive" },
      }),
    },
  });
}
