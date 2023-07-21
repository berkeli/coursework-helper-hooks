import React, { useEffect } from "react";

/**
 * Props for the RedirectWithTimeout component.
 */
interface RedirectWithTimeoutProps {
  /**
   * The URL to redirect to.
   */
  to: string;
  /**
   * The timeout duration in seconds.
   * Default: 3 seconds.
   */
  timeoutSeconds?: number;
}

/**
 * Redirects to a specified URL after a specified timeout.
 *
 * @param {string} to - The PATH to redirect to.
 * @param {number} timeoutSeconds - The timeout duration in seconds, defaults to 3.
 * @returns {JSX.Element} - The component JSX.
 */
const RedirectWithTimeout = ({ to, timeoutSeconds }: RedirectWithTimeoutProps): JSX.Element => {
  // Set the default timeout to 3 seconds if not provided
  const time = timeoutSeconds === undefined ? 3 : timeoutSeconds;

  useEffect(() => {
    /**
     * Interval to redirect to the specified URL after the specified timeout.
     */
    const timeout = setTimeout(() => {
      window.location.replace(to);
    }, time * 1000);

    // Clean up the interval when the component is unmounted or the dependencies change
    return () => clearInterval(timeout);
  }, []);

  return <div>Redirecting in {time} seconds</div>;
};

export default RedirectWithTimeout;
