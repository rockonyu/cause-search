import { useDebounce } from "@/hooks/use-debounce";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Cause from "./page";

jest.mock("@/hooks/use-debounce", () => ({
  useDebounce: jest.fn((value) => value),
}));

jest.mock("./organizations", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="organizations-component" />),
}));

describe("Cause 元件", () => {
  it("應該正確渲染初始狀態", () => {
    render(<Cause organizations={{ data: [] }} />);

    // 檢查是否渲染了 Tabs 和初始內容
    expect(screen.getByText("公益團體")).toBeInTheDocument();
    expect(screen.getByText("捐款專案")).toBeInTheDocument();
    expect(screen.getByText("義賣商品")).toBeInTheDocument();
    expect(screen.getByTestId("organizations-component")).toBeInTheDocument();
  });

  it("應該在點擊搜尋按鈕時顯示搜尋輸入框", () => {
    render(<Cause organizations={{ data: [] }} />);

    // 點擊搜尋按鈕
    const searchButton = screen.getByRole("button", { name: "search" });
    fireEvent.click(searchButton);

    // 檢查搜尋輸入框是否顯示
    const input = screen.getByPlaceholderText("請輸入關鍵字");
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it("應該在取消搜尋時隱藏搜尋輸入框並清空輸入值", async () => {
    render(<Cause organizations={{ data: [] }} />);

    // 點擊搜尋按鈕
    const searchButton = screen.getByRole("button", { name: "search" });
    fireEvent.click(searchButton);

    // 取得搜尋按鈕外層容器
    const container = searchButton.parentElement;

    waitFor(() => {
      // 確保搜尋輸入框顯示
      expect(container).not.toHaveClass("h-0");
    });

    const input = screen.getByPlaceholderText("請輸入關鍵字");

    fireEvent.change(input, { target: { value: "測試關鍵字" } });
    expect(input).toHaveValue("測試關鍵字");

    // 點擊取消按鈕
    const cancelButton = screen.getByRole("button", { name: "取消" });
    fireEvent.click(cancelButton);

    expect(input).toHaveValue("");

    waitFor(() => {
      // 確保搜尋輸入框隱藏
      expect(container).toHaveClass("h-0");
    });
  });

  it("應該正確切換 Tabs 並顯示對應內容", () => {
    render(<Cause organizations={{ data: [] }} />);

    // 點擊 "捐款專案" Tab
    const projectsTab = screen.getByText("捐款專案");
    fireEvent.click(projectsTab);

    // 檢查是否顯示對應內容
    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(
      screen.queryByTestId("organizations-component"),
    ).not.toBeInTheDocument();

    // 點擊 "義賣商品" Tab
    const productsTab = screen.getByText("義賣商品");
    fireEvent.click(productsTab);

    // 檢查是否顯示對應內容
    expect(screen.getByText("products")).toBeInTheDocument();
    expect(screen.queryByText("projects")).not.toBeInTheDocument();
  });

  it("應該在輸入搜尋關鍵字時更新搜尋值", () => {
    render(<Cause organizations={{ data: [] }} />);

    // 點擊搜尋按鈕
    const searchButton = screen.getByRole("button", { name: "search" });
    fireEvent.click(searchButton);

    // 輸入搜尋關鍵字
    const input = screen.getByPlaceholderText("請輸入關鍵字");
    fireEvent.change(input, { target: { value: "測試關鍵字" } });

    // 確保搜尋值更新
    expect(input).toHaveValue("測試關鍵字");
    expect(useDebounce).toHaveBeenCalledWith("測試關鍵字", 300);
  });
});
