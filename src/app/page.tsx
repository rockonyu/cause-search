export const dynamic = "force-dynamic";

import { fetchApi } from "@/lib/utils";
import type { Organization } from "@prisma/client";
import { pageFirst } from "../../tests/mocks/organizations/page-first";
import Cause from "./cause/page";

export default async function Home() {
  const organizations =
    // 作為展示用途
    process.env.IS_PLAYWRIGHT === "true"
      ? pageFirst
      : await fetchApi<{
          data: Organization[];
          nextCursor?: string | null;
        }>("/api/organizations");

  return (
    <div className="min-h-dvh bg-[#F4F4F6]">
      <div className="sticky top-0 z-10 h-11 w-full bg-[#C9191D] text-center leading-11 font-bold text-white">
        所有捐款項目
      </div>

      <Cause organizations={organizations} />
    </div>
  );
}
