import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "./use-debounce";

describe("useDebounce", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("應該返回初始值", () => {
    const { result } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "init" },
    });

    expect(result.current).toBe("init");
  });

  it("不應該在延遲時間內更新值", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "init" } },
    );

    // 更新值
    rerender({ value: "updated" });

    // 確保在延遲時間內值未更新
    expect(result.current).toBe("init");

    act(() => {
      jest.advanceTimersByTime(299);
    });

    expect(result.current).toBe("init");
  });

  it("應該在延遲時間後更新值", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "init" } },
    );

    // 更新值
    rerender({ value: "updated" });

    // 快進 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("應該在多次快速更新值後只返回最後一次的值", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "init" } },
    );

    rerender({ value: "value 1" });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "value 2" });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    rerender({ value: "value 3" });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("value 3");
  });

  it("不應該在清除計時器後更新值", () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "init" } },
    );

    // 更新值
    rerender({ value: "updated" });

    // 卸載 Hook
    unmount();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // 值不應該更新
    expect(result.current).toBe("init");
  });
});
