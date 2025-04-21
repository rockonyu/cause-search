import { fetchApi } from "@/lib/utils";
import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("@/lib/utils", () => ({
  fetchApi: jest.fn(),
}));

jest.mock("./cause/page", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="cause-component" />),
}));

describe("Home 元件", () => {
  it("在 IS_PLAYWRIGHT 為 true 不應該呼叫 fetchApi", async () => {
    process.env.IS_PLAYWRIGHT = "true";

    render(await Home());

    expect(fetchApi).not.toHaveBeenCalled();

    // 檢查 Cause 元件是否渲染
    expect(screen.getByTestId("cause-component")).toBeInTheDocument();
  });

  it("在 IS_PLAYWRIGHT 為 false 應該呼叫 fetchApi", async () => {
    process.env.IS_PLAYWRIGHT = "false";

    (fetchApi as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: "Test Organization" }],
      nextCursor: null,
    });

    render(await Home());

    // 檢查 fetchApi 是否被調用
    expect(fetchApi).toHaveBeenCalledWith("/api/organizations");

    // 檢查 Cause 元件是否渲染
    expect(screen.getByTestId("cause-component")).toBeInTheDocument();
  });

  it("應該正確渲染標題", async () => {
    process.env.IS_PLAYWRIGHT = "true";

    render(await Home());

    // 檢查標題是否正確渲染
    expect(screen.getByText("所有捐款項目")).toBeInTheDocument();
  });
});
