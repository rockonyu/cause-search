"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Organization } from "@prisma/client";
import Organizations from "./organizations";

type CauseProps = {
  organizations?: {
    data: Organization[];
    nextCursor?: string | null;
  };
};

export default function Cause({ organizations }: CauseProps) {
  return (
    <Tabs defaultValue="organizations">
      <TabsList>
        <TabsTrigger value="organizations">公益團體</TabsTrigger>
        <TabsTrigger value="projects">捐款專案</TabsTrigger>
        <TabsTrigger value="products">義賣商品</TabsTrigger>
      </TabsList>

      <div className="px-6 py-4">
        <div className="mb-4 flex h-8 w-full items-center justify-between">
          <span>全部</span> <span>搜尋</span>
        </div>

        <TabsContent value="organizations">
          <Organizations initialData={organizations} />
        </TabsContent>
        <TabsContent value="projects">projects</TabsContent>
        <TabsContent value="products">products</TabsContent>
      </div>
    </Tabs>
  );
}
