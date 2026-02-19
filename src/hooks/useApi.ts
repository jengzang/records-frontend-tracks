import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

// Custom hook for API calls
export const useApi = <T,>(
  apiFunc: () => Promise<T>,
  deps: any[] = []
): UseApiState<T> & { refetch: () => void } => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiFunc();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: fetchData };
};
