import { useCallback, useState, type PropsWithChildren } from "react";
import { TabsContext } from "./tabs-context";

export const Tabs = ({
  defaultValue = "",
  children,
}: PropsWithChildren<{ defaultValue?: string }>) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [tabRefs, setTabRefs] = useState<Record<string, HTMLDivElement | null>>(
    {},
  );

  const registerRef = useCallback(
    (value: string, el: HTMLDivElement | null) => {
      setTabRefs((prevRefs) => ({
        ...prevRefs,
        [value]: el,
      }));
    },
    [],
  );

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab, registerRef, tabRefs }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export default Tabs;
