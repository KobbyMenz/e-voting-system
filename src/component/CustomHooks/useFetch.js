import { useEffect, useState, useRef } from "react";

const useFetch = (url) => {
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
          setLoading(true);
        }
      }
    };
    fetchData();

    return () => controller.abort();
  }, [refetch, url, isFirstRender]);

  return { data, loading, setRefetch, isFirstRender };
};
export default useFetch;
