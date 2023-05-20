import { useState, useEffect } from "react";

const useIssues = (apiURL: string, module: string, week: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = new URL(`${apiURL}/github/issues`);
  API_URL.searchParams.append("repo", module);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setLoading(false);
        setData(data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [module, week]);

  return {
    data,
    loading,
    error,
  };
};

export default useIssues;
