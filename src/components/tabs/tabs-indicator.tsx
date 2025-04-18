import { cn } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import { TabsContext } from "./tabs-context";

export const TabsIndicator = () => {
  const { activeTab, tabRefs } = use(TabsContext);
  const currentTabRef = tabRefs?.[activeTab];

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!currentTabRef || isReady) {
      return;
    }

    setIsReady(true);
  }, [currentTabRef, isReady]);

  return (
    <div
      className={cn(
        "absolute bottom-0 h-1 rounded-tl-2xl rounded-tr-2xl bg-[#D63F3C]",
        {
          // 第一次進入不執行動畫
          "transition-[left,width] duration-300": isReady,
        },
      )}
      style={{
        left: currentTabRef?.offsetLeft ?? 0,
        width: currentTabRef?.offsetWidth ?? 0,
      }}
    ></div>
  );
};
