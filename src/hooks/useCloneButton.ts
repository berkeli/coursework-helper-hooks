import { useState } from "react";

interface UseCloneButtonReturn {
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
const useCloneButton = (apiURL: string, token: string, module: string, issue?: number): UseCloneButtonReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState(null);

  const clone = () => {
    setLoading(true);
    const url = issue ? `${apiURL}/github/clone/${module}/${issue}` : `${apiURL}/github/clone/${module}`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setLoading(false);
        setSuccess(data.message);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return {
    loading,
    error,
    success,
    clone,
  };
};

export default useCloneButton;
