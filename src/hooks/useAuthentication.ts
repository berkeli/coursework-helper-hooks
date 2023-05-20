import { useState, useEffect } from "react";
import { getTokenFromLS, removeTokenFromLS, setTokenToLS } from "../helpers";

const useAuthentication = (apiURL: string) => {
  const [token, setToken] = useState(getTokenFromLS());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(getTokenFromLS() !== null);

  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const state = queryParameters.get("state") ? JSON.parse(queryParameters.get("state") || "") : null;

  useEffect(() => {
    if (isAuthenticated || !code) {
      setLoading(false);
      return;
    }

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
        setError(err);
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
