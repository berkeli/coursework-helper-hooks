import { useState } from "react";
import { cloneIssue } from "../helpers";

interface UseCloneMutationReturn {
  /**
   * Boolean representing whether the cloning process is loading or not.
   */
  loading: boolean;
  /**
   * Error message returned from the API.
   */
  error: string | undefined;
  /**
   * Success message returned from the API.
   */
  success: string | null;
  /**
   * Clone issues from the GitHub repository.
   */
  clone: () => void;
}

/**
 * Custom hook for cloning a GitHub repository.
 * @param apiURL - The base URL of the API.
 * @param token - The access token for authorization.
 * @param module - The name of the module/repository.
 * @param issue - Optional. The issue number to clone.
 * @returns An object containing loading, error, success states, and a clone function.
 */
const useCloneMutation = (apiURL: string, token: string, module: string, sprint?: string, issue?: number): UseCloneMutationReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(null);

  const clone = () => {
    setLoading(true);

    cloneIssue(apiURL, token, module, sprint, issue)
      .then((data) => {
        setSuccess(data);
      })
      .catch((err) => {
        setError(err.message);
        setSuccess(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    loading,
    error,
    success,
    clone,
  };
};

export default useCloneMutation;
