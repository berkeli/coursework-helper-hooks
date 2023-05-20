import { useState } from "react";

const useCloneButton = (apiURL: string, token: string, module: string, issue?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
