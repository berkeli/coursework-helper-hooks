import { useState, useEffect } from "react";
import { getTokenFromLS, removeTokenFromLS, setTokenToLS } from "../helpers";

interface UseAuthenticationReturn {
  /**
   * Token returned from the API.
   */
  token: string | null;
  /**
   * Boolean representing whether the authentication process is loading or not.
   */
  loading: boolean;
  /**
   * Error message returned from the API.
   */
  error: string | null;
  /**
   * Boolean representing whether the user is authenticated or not.
   */
  isAuthenticated: boolean;
  /**
   * Sign out the user by removing the token from localStorage and setting the isAuthenticated state to false.
   */
  signOut: () => void;
  /**
   * Redirect path to be used after successful authentication.
   */
  redirectPath: string;
}

/**
 * Custom hook for handling authentication.
 * @param apiURL - The base URL of the API.
 * @returns {object} An object containing the token, loading state, error state, and a signOut function.
 */
const useAuthentication = (apiURL: string): UseAuthenticationReturn => {
  const [token, setToken] = useState<string | null>(getTokenFromLS());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getTokenFromLS() !== null);

  const queryParameters = new URLSearchParams(window.location.search);

  const code = queryParameters.get("code");
  const state = queryParameters.get("state") ? JSON.parse(queryParameters.get("state") || "") : null;

  useEffect(() => {
    // If already authenticated or no code is present, stop loading and return
    if (isAuthenticated || !code) {
      setLoading(false);
      return;
    }

    // Authenticate using the provided code
    fetch(`${apiURL}/auth?code=${code}`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setTokenToLS(data.token);
        setToken(data.token);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
        removeTokenFromLS();
      });
  }, [token]);

  const signOut = () => {
    removeTokenFromLS();
    setIsAuthenticated(false);
  };

  return {
    token,
    loading,
    error,
    isAuthenticated,
    signOut,
    redirectPath: state?.prevPath,
  };
};

export default useAuthentication;
