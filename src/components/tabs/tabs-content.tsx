import { use, type PropsWithChildren } from "react";
import { TabsContext } from "./tabs-context";

export const TabsContent = ({
  className,
  value,
  children,
}: PropsWithChildren<{ className?: string; value: string }>) => {
  const { activeTab } = use(TabsContext);

  return activeTab === value ? (
    <div className={className}>{children}</div>
  ) : null;
};
