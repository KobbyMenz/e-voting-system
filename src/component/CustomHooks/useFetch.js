import { useEffect, useState, useRef } from "react";

const useFetch = (url, autoRefreshInterval = 0) => {
  const [data, setData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(false);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false;
    //   return;
    // }

    const controller = new AbortController();
    const signal = controller.signal;

    //=======Fetching all products from database======
    const fetchData = async () => {
      try {
        const response = await fetch(url, { signal });

        const data = await response.json();

        if (data.result) {
          setData(data.result);

          setLoading(false);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err.message);
          setLoading(true);
        }
      }
    };
    fetchData();

    // Setup auto-refresh interval if specified
    let refreshInterval = null;
    if (autoRefreshInterval > 0) {
      refreshInterval = setInterval(() => {
        fetchData();
      }, autoRefreshInterval);
    }

    return () => {
      controller.abort();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refetch, url, isFirstRender, autoRefreshInterval]);

  return { data, setRefetch, loading, isFirstRender };
};
export default useFetch;
