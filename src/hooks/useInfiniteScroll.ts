import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    enabled: boolean;
}

function useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore,
    enabled,
}: UseInfiniteScrollProps) {


    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!enabled) return;
        if (!observerRef.current) return;

        const observer = new IntersectionObserver((entries) => {

            const entry = entries[0];// As we will add only one Sentinel div
            console.log("Intersected Element", entry);

            if (!loading && hasMore && entry.isIntersecting) {
                onLoadMore();
            }

        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [loading, hasMore, onLoadMore]);

    return { observerRef };
}

export default useInfiniteScroll;

