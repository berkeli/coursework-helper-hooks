import { useState, useEffect } from "react";

interface UseIssuesReturn {
  /**
   * Data returned from the API.
   * @type {object}
   */
  data: object | null;
  /**
   * Boolean representing whether the issues are loading or not.
   * @type {boolean}
   * @default true
   */
  loading: boolean;
  /**
   * Error message returned from the API.
   * @type {string}
   * @default undefined
   */
  error: string | undefined;
  /**
   * Function to trigger a re-fetch of the issues.
   * @type {function}
   */
  reFetch: () => void;
}

/**
 * Custom hook for fetching GitHub issues.
 * @param {string} apiURL - The base URL of the API.
 * @param {string} module - The name of the module/repository.
 * @returns {object} An object containing data, loading, error states, and a reFetch function.
 */
const useIssues = (apiURL: string, module: string): UseIssuesReturn => {
  const [data, setData] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [trigger, setTrigger] = useState<boolean>(false);

  const reFetch = () => setTrigger(!trigger);

  const url = new URL(`${apiURL}/github/issues`);
  url.searchParams.append("repo", module);

  useEffect(() => {
    setLoading(true);
    fetch(url)
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
  }, [module, trigger]);

  return {
    data,
    loading,
    error,
    reFetch,
  };
};

export default useIssues;
