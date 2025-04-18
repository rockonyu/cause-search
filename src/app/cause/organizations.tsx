"use client";

import type { Organization } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type OrganizationsProps = {
  initialData?: {
    data: Organization[];
    nextCursor?: string | null;
  };
  search?: string;
  category?: string;
};

export default function Organizations({ initialData }: OrganizationsProps) {
  const [organizations] = useState<Organization[]>(initialData?.data ?? []);

  return (
    <ul>
      {organizations.map((org) => (
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
              ({org.description})
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
