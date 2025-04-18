import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { TabsIndicator } from "./tabs-indicator";

export const TabsList = ({
  className,
  children,
}: PropsWithChildren & { className?: string }) => {
  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-11 items-center justify-around bg-white font-medium",
          className,
        )}
      >
        {children}
      </div>

      <TabsIndicator />
    </div>
  );
};
