import { createContext } from "react";

export const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
  registerRef: (value: string, el: HTMLDivElement | null) => void;
  tabRefs: Record<string, HTMLDivElement | null>;
}>({
  activeTab: "",
  setActiveTab: () => {},
  registerRef: () => {},
  tabRefs: {},
});
