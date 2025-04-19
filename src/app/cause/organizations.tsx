"use client";

import Loader from "@/components/loader";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import { fetchApi } from "@/lib/utils";
import type { Organization } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type OrganizationsData = {
  data: Organization[];
  nextCursor?: string | null;
};

type OrganizationsProps = {
  initialData?: OrganizationsData;
  search: string;
  category?: string;
};

export default function Organizations({
  initialData,
  search = "",
}: OrganizationsProps) {
  const [organizations, setOrganizations] = useState<
    OrganizationsData | undefined
  >(initialData);

  const controllerRef = useRef<AbortController | null>(null);

  const fetchOrganizations = useCallback(
    async (
      params: Record<string, string | null | undefined>,
      append = false,
    ) => {
      controllerRef.current?.abort("Aborting previous request");

      const controller = new AbortController();
      controllerRef.current = controller;

      const { data, nextCursor } = await fetchApi<OrganizationsData>(
        "/api/organizations",
        { params, signal: controller.signal },
      );

      if (controller.signal.aborted) {
        return;
      }

      setOrganizations((prev) => ({
        data: append ? (prev?.data ?? []).concat(data) : data,
        nextCursor,
      }));

      return { data, nextCursor };
    },
    [],
  );

  const prevSearch = useRef<string | undefined>("");
  const searchCache = useRef<Record<string, OrganizationsData>>({});
  const [isSearching, setIsSearching] = useState(prevSearch.current !== search);

  useEffect(() => {
    if (prevSearch.current === search) {
      return;
    }

    if (searchCache.current[search]) {
      setOrganizations(searchCache.current[search]);
      prevSearch.current = search;
      return;
    }

    setIsSearching(true);

    fetchOrganizations({ q: search })
      .then((res) => {
        if (res) {
          searchCache.current[search] = res;
        }

        prevSearch.current = search;
        setIsSearching(false);
      })
      .catch(console.log);
  }, [fetchOrganizations, initialData, search]);

  const hasMore = Boolean(organizations?.nextCursor);

  const loadMore = useCallback(async () => {
    if (!organizations || !hasMore) {
      return;
    }

    try {
      await fetchOrganizations(
        { q: search, "created-at": organizations.nextCursor },
        true,
      );
    } catch (error) {
      console.log(error);
    }
  }, [fetchOrganizations, hasMore, organizations, search]);

  const { targetRef, isLoading } = useInfiniteScroll({ loadMore, hasMore });

  if (isSearching) {
    return (
      <div className="flex h-[calc(100vh-11rem)] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isSearching && organizations?.data.length === 0) {
    return (
      <div className="flex h-[calc(100vh-24rem)] flex-col items-center justify-center">
        <Image
          className=""
          src="/no-data.svg"
          alt="no-data"
          width={144}
          height={144}
        />

        <p className="text-xl leading-8 text-black/90">查無相關資料</p>
        <p className="text-sm leading-6 font-normal text-black/50">
          請調整關鍵字再重新查詢
        </p>
      </div>
    );
  }

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
