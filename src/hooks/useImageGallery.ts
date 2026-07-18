import { useState, useCallback, useRef } from 'react';
import { PicsumImage } from '../types';

const LIMIT = 20;
const BASE_URL = 'https://picsum.photos/v2/list';

export function useImageGallery() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const isFetching = useRef(false); // prevents duplicate concurrent calls

  const blockedRef = useRef(false); // set on failure; blocks auto-retries (e.g. onEndReached) until manual retry

  const fetchPage = useCallback(async (pageToFetch: number, isRefresh = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setError(null);
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}?page=${pageToFetch}&limit=${LIMIT}`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: PicsumImage[] = await res.json();

      setImages((prev) => (isRefresh ? data : [...prev, ...data]));
      setHasMore(data.length === LIMIT);
      setPage(pageToFetch);
      blockedRef.current = false;
    } catch (err: any) {
      blockedRef.current = true; // stop further auto-triggered fetches (e.g. onEndReached) until explicit retry
      setError(
        err?.message === 'Network request failed'
          ? 'No internet connection. Please check your network and try again.'
          : 'Failed to load images. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetching.current = false;
    }
  }, []);

  const loadInitial = useCallback(() => {
    blockedRef.current = false;
    fetchPage(1, false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || isFetching.current || blockedRef.current) return;
    fetchPage(page + 1, false);
  }, [fetchPage, page, hasMore, loading]);

  const refresh = useCallback(() => {
    blockedRef.current = false;
    fetchPage(1, true);
  }, [fetchPage]);

  const retry = useCallback(() => {
    blockedRef.current = false;
    fetchPage(page, false);
  }, [fetchPage, page]);

  return { images, loading, refreshing, error, hasMore, loadInitial, loadMore, refresh, retry };
}