"use client";

import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Organization } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Organizations from "./organizations";

const DEBOUNCE_DELAY = 300;

type CauseProps = {
  organizations?: {
    data: Organization[];
    nextCursor?: string | null;
  };
};

export default function Cause({ organizations }: CauseProps) {
  const [value, setValue] = useState<string>("");
  const search = useDebounce(value, DEBOUNCE_DELAY);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    if (!showSearchInput) {
      setValue("");
      searchInputRef.current?.blur();
      return;
    }

    searchInputRef.current?.focus();
  }, [showSearchInput]);

  return (
    <>
      <div
        className={cn(
          "flex h-0 items-center justify-between gap-4 overflow-hidden bg-white px-6 transition-[height]",
          { "h-16": showSearchInput },
        )}
      >
        <div className="relative grow">
          <Image
            src="/union.svg"
            alt="search"
            width={16}
            height={16}
            className="absolute top-1/2 left-3 -translate-y-1/2"
          />

          <input
            ref={searchInputRef}
            className="h-9 w-full rounded-3xl bg-black/5 pr-4 pl-10 text-sm focus-visible:outline-none"
            type="text"
            value={value}
            onChange={({ target }) => setValue(target.value)}
            placeholder="請輸入關鍵字"
          />
        </div>

        <button
          type="button"
          className="cursor-pointer text-[#2E7DD9]"
          onClick={() => setShowSearchInput(false)}
        >
          取消
        </button>
      </div>

      <Tabs defaultValue="organizations">
        <TabsList>
          <TabsTrigger value="organizations">公益團體</TabsTrigger>
          <TabsTrigger value="projects">捐款專案</TabsTrigger>
          <TabsTrigger value="products">義賣商品</TabsTrigger>
        </TabsList>

        <div className="px-6 py-4">
          <div
            className={cn(
              "mb-4 flex h-9 w-full items-center justify-between overflow-hidden transition-[height,margin]",
              { "mb-0 h-0": showSearchInput },
            )}
          >
            <button
              className="h-9 rounded-lg bg-[#EDEDF1] px-4 text-sm text-black/50"
              disabled
            >
              全部
            </button>

            <button
              type="button"
              className="relative h-9 w-9 cursor-pointer rounded-full bg-[#EDEDF1]"
              onClick={() => setShowSearchInput((prev) => !prev)}
            >
              <Image
                src="/union.svg"
                alt="search"
                width={16}
                height={16}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </button>
          </div>

          <TabsContent value="organizations">
            <Organizations initialData={organizations} search={search} />
          </TabsContent>
          <TabsContent value="projects">projects</TabsContent>
          <TabsContent value="products">products</TabsContent>
        </div>
      </Tabs>
    </>
  );
}
