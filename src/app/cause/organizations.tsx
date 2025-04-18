"use client";

import Loader from "@/components/loader";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { fetchApi } from "@/lib/utils";
import type { Organization } from "@prisma/client";
import Image from "next/image";
import { useCallback, useState } from "react";

type OrganizationsData = {
  data: Organization[];
  nextCursor?: string | null;
};

type OrganizationsProps = {
  initialData?: OrganizationsData;
  search?: string;
  category?: string;
};

export default function Organizations({ initialData }: OrganizationsProps) {
  const [organizations, setOrganizations] = useState<
    OrganizationsData | undefined
  >(initialData);

  const hasMore = Boolean(organizations?.nextCursor);

  const loadMore = useCallback(async () => {
    if (!organizations || !hasMore) {
      return;
    }

    const { data, nextCursor } = await fetchApi<{
      data: Organization[];
      nextCursor: string | null;
    }>(`/api/organizations?created-at=${organizations.nextCursor}`);

    setOrganizations((prev) => ({
      data: (prev?.data ?? []).concat(data),
      nextCursor,
    }));
  }, [hasMore, organizations]);

  const { targetRef, isLoading } = useInfiniteScroll({ loadMore, hasMore });

  return (
    <>
      <ul>
        {organizations?.data.map((org) => (
          <li
            className="mb-4 flex items-center gap-4 rounded-2xl bg-white p-4"
            key={org.id}
          >
            <Image
              className="h-16 w-16 shrink-0 rounded-lg border-[1px] border-black/10 bg-cover"
              src={org.thumbnail}
              alt={org.name}
              width={64}
              height={64}
            />

            <div className="w-full min-w-0">
              <h3 className="leading-6 font-medium">{org.name}</h3>

              <p className="overflow-hidden text-sm leading-5 text-ellipsis whitespace-nowrap text-black/70">
                {org.description}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {isLoading ? (
        <Loader />
      ) : (
        <div
          ref={targetRef}
          className="relative text-center text-sm text-black/20 after:absolute after:top-1/2 after:left-0 after:w-full after:border-t-[1px] after:border-black/20 after:content-['']"
        >
          <span className="relative z-10 bg-[#F4F4F6] px-4">愛心沒有底線</span>
        </div>
      )}
    </>
  );
}
