import { act, renderHook } from "@testing-library/react";
import { useInfiniteScroll } from "./use-infinite-scroll";

describe("useInfiniteScroll", () => {
  let loadMoreMock: jest.Mock;
  let observerCallback: (entries: IntersectionObserverEntry[]) => void;

  beforeAll(() => {
    global.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
      };
    }) as unknown as typeof IntersectionObserver;
  });

  beforeEach(() => {
    loadMoreMock = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );
  });

  it("應該返回初始值", () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, loadMore: loadMoreMock }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.targetRef.current).toBe(null);
  });

  it("應該字在目標元素進入視窗後呼叫 loadMore", async () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, loadMore: loadMoreMock }),
    );

    // 模擬目標元素進入視窗
    act(() => {
      result.current.targetRef.current = document.createElement("div");
    });

    // 第一次觸發 observerCallback
    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // 等待狀態更新
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // 確保 isLoading 被設為 true
    expect(result.current.isLoading).toBe(true);

    // 等待 loadMoreMock 完成
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // 確保 isLoading 被設回 false
    expect(result.current.isLoading).toBe(false);

    // 確保 loadMore 被呼叫一次
    expect(loadMoreMock).toHaveBeenCalledTimes(1);
  });

  it("不應該在當 isLoading 為 true 時，重複觸發 loadMore", async () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, loadMore: loadMoreMock }),
    );

    // 模擬目標元素進入視窗
    act(() => {
      result.current.targetRef.current = document.createElement("div");
    });

    // 第一次觸發 observerCallback
    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // 等待狀態更新
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    // 確保 isLoading 被設為 true
    expect(result.current.isLoading).toBe(true);

    // 第二次觸發 observerCallback
    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // 確保 loadMore 被呼叫一次
    expect(loadMoreMock).toHaveBeenCalledTimes(1);
  });

  it("應該在目標元素進入視窗後，能觸發多次 loadMore", async () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, loadMore: loadMoreMock }),
    );

    // 模擬目標元素進入視窗
    act(() => {
      result.current.targetRef.current = document.createElement("div");
    });

    // 第一次觸發 observerCallback
    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // 等待 loadMore 執行完成狀態更新
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // 第二次觸發 observerCallback
    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    // 確保 loadMore 被呼叫兩次
    expect(loadMoreMock).toHaveBeenCalledTimes(2);
  });

  it("不應該在當 hasMore 為 false 時，呼叫 loadMore", async () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({ hasMore: false, loadMore: loadMoreMock }),
    );

    act(() => {
      result.current.targetRef.current = document.createElement("div");
    });

    await act(async () => {
      observerCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(loadMoreMock).not.toHaveBeenCalled();
  });

  it("應該在元件 unmount 時清除 observer", () => {
    const disconnectMock = jest.fn();
    const observeMock = jest.fn();

    global.IntersectionObserver = jest.fn(() => ({
      observe: observeMock,
      disconnect: disconnectMock,
    })) as unknown as typeof IntersectionObserver;

    const { unmount } = renderHook(() =>
      useInfiniteScroll({ hasMore: true, loadMore: loadMoreMock }),
    );

    unmount();

    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });
});
