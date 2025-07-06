import axios from 'axios';
import { useEffect, useState } from 'react';

export type FetchReturn<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

export type Options = {
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  shouldMakeCall?: boolean;
};

export const useFetch = <T>(url: string, options?: Options): FetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    if (options?.shouldMakeCall === false) {
      return () => {
        abortController.abort();
      };
    }

    axios({
      url,
      method: options?.method ?? 'GET',
      headers: options?.headers ?? {},
      signal: abortController.signal,
    })
      .then(({ data }) => {
        setData(() => data);
        setError(() => false);
        setLoading(() => false);
      })
      .catch((e) => {
        if (e.code !== 'ERR_CANCELED') {
          setData(() => null);
          setError(() => true);
          setLoading(() => false);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [url, options?.shouldMakeCall]);

  return { data, loading, error };
};
