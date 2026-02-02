import { useEffect, useState, useRef } from "react";
import app_api_url from "../../app_api_url";

const useFetch = (endPointName) => {
  const [fetchedData, setFetchedData] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const isFirstRender = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    //=======Fetching all products from database======
    const fetchData = async () => {
      try {
        const response = await fetch(`${app_api_url}/${endPointName}`, {
          signal,
        });

        const data = await response.json();

        if (data.result) {
          setFetchedData(data.result);

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
  }, [endPointName, refetch, isFirstRender]);

  return { fetchedData, setRefetch, loading, isFirstRender };
};
export default useFetch;
