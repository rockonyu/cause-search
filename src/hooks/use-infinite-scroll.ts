import { useCallback, useEffect, useRef, useState } from "react";

interface UseInfiniteScrollParams {
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export const useInfiniteScroll = ({
  hasMore,
  loadMore,
}: UseInfiniteScrollParams) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onIntersect = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    setIsLoading(true);

    try {
      await loadMore();
    } catch (err) {
      console.error("InfiniteScroll error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, loadMore]);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onIntersect();
      }
    });

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, onIntersect]);

  return { isLoading, hasMore, targetRef };
};

export default useInfiniteScroll;
