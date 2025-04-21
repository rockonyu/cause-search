import { fetchApi } from "@/lib/utils";
import { render, screen, waitFor } from "@testing-library/react";
import Organizations from "./organizations";

jest.mock("@/lib/utils", () => ({
  fetchApi: jest.fn(),
}));

jest.mock("@/hooks/use-infinite-scroll", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    targetRef: jest.fn(),
    isLoading: false,
  })),
}));

describe("Organizations 元件", () => {
  it("應該正確渲染初始資料", () => {
    const initialData = {
      data: [
        {
          id: "1",
          name: "組織 A",
          description: "描述 A",
          thumbnail: "/a.jpg",
          createdAt: new Date(),
        },
        {
          id: "2",
          name: "組織 B",
          description: "描述 B",
          thumbnail: "/b.jpg",
          createdAt: new Date(),
        },
      ],
      nextCursor: null,
    };

    render(<Organizations initialData={initialData} search="" />);

    // 檢查是否正確渲染初始資料
    expect(screen.getByText("組織 A")).toBeInTheDocument();
    expect(screen.getByText("描述 A")).toBeInTheDocument();
    expect(screen.getByText("組織 B")).toBeInTheDocument();
    expect(screen.getByText("描述 B")).toBeInTheDocument();
  });

  it("應該在頁面最下方顯示 Loader", () => {
    render(<Organizations initialData={{ data: [] }} search="測試" />);

    // 檢查是否顯示 Loader
    expect(screen.getByAltText("shimmer")).toBeInTheDocument();
  });

  it("應該在查無資料時顯示提示訊息", async () => {
    (fetchApi as jest.Mock).mockResolvedValue({ data: [], nextCursor: null });

    render(<Organizations initialData={{ data: [] }} search="無結果" />);

    // 等待查詢完成
    await waitFor(() => {
      expect(screen.getByText("查無相關資料")).toBeInTheDocument();
      expect(screen.getByText("請調整關鍵字再重新查詢")).toBeInTheDocument();
    });
  });

  it("應該正確處理搜尋請求", async () => {
    (fetchApi as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          name: "搜尋結果 A",
          description: "描述 A",
          thumbnail: "/a.jpg",
        },
      ],
      nextCursor: null,
    });

    render(<Organizations initialData={{ data: [] }} search="搜尋" />);

    // 等待搜尋完成
    await waitFor(() => {
      expect(screen.getByText("搜尋結果 A")).toBeInTheDocument();
      expect(screen.getByText("描述 A")).toBeInTheDocument();
    });
  });
});
