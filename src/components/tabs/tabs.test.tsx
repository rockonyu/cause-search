import { fireEvent, render, screen } from "@testing-library/react";
import Tabs from "./tabs";
import { TabsContent } from "./tabs-content";
import { TabsList } from "./tabs-list";
import { TabsTrigger } from "./tabs-trigger";

describe("Tabs 元件", () => {
  it("應該正確渲染初始的 activeTab", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">內容 1</TabsContent>
        <TabsContent value="tab2">內容 2</TabsContent>
      </Tabs>,
    );

    // 確保 Tab 1 被渲染為 active
    expect(screen.getByText("Tab 1")).toHaveClass("text-black");
    expect(screen.getByText("內容 1")).toBeInTheDocument();

    // 確保 Tab 2 沒有被渲染為 active
    expect(screen.getByText("Tab 2")).toHaveClass("text-black/50");
    expect(screen.queryByText("內容 2")).not.toBeInTheDocument();
  });

  it("應該在點擊 Tab 時切換 activeTab", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">內容 1</TabsContent>
        <TabsContent value="tab2">內容 2</TabsContent>
      </Tabs>,
    );

    // 點擊 Tab 2
    fireEvent.click(screen.getByText("Tab 2"));

    // 確保 Tab 2 被渲染為 active
    expect(screen.getByText("Tab 2")).toHaveClass("text-black");
    expect(screen.getByText("內容 2")).toBeInTheDocument();

    // 確保 Tab 1 沒有被渲染為 active
    expect(screen.getByText("Tab 1")).toHaveClass("text-black/50");
    expect(screen.queryByText("內容 1")).not.toBeInTheDocument();
  });

  it("應該正確處理沒有 activeTab 的情況", () => {
    render(
      <Tabs>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">內容 1</TabsContent>
        <TabsContent value="tab2">內容 2</TabsContent>
      </Tabs>,
    );

    // 確保沒有 activeTab 時，內容不顯示
    expect(screen.queryByText("內容 1")).not.toBeInTheDocument();
    expect(screen.queryByText("內容 2")).not.toBeInTheDocument();
  });
});
