import { cn } from "@/lib/utils";
import { use, useEffect, useRef, type PropsWithChildren } from "react";
import { TabsContext } from "./tabs-context";

type TabsTriggerProps = {
  value: string;
};

export const TabsTrigger = ({
  value,
  children,
}: PropsWithChildren<TabsTriggerProps>) => {
  const { activeTab, setActiveTab, registerRef } = use(TabsContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;

    registerRef(value, current);

    window.addEventListener("resize", () => {
      registerRef(value, current);
    });

    return () => {
      window.removeEventListener("resize", () => {
        registerRef(value, current);
      });
    };
  }, [registerRef, value]);

  return (
    <div
      ref={ref}
      className={cn("cursor-pointer text-black", {
        "text-sm text-black/50": activeTab !== value,
      })}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </div>
  );
};
