import React from "react";
import useAuthentication from "../hooks/useAuthentication";
import { githubLoginUrl } from "../helpers";

/**
 * Props for the SignInButton component.
 */
interface SignInButtonProps {
  /**
   * The client ID for GitHub OAuth.
   */
  clientId: string;
  /**
   * The API URL.
   */
  apiUrl: string;
  /**
   * Additional scopes for GitHub OAuth. Defaults are "project, repo".
   */
  scopes?: string[];
  /**
   * Optional class names for styling.
   */
  classNames?: {
    /**
     * Class name for the sign-in button.
     */
    signInButton?: string;
    /**
     * Class name for the sign-out button.
     */
    signOutButton?: string;
  };
}

/**
 * Component representing a sign-in/sign-out button for GitHub authentication.
 * @param {SignInButtonProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
const SignInButton = ({ clientId, apiUrl, classNames, scopes }: SignInButtonProps): JSX.Element => {
  const { isAuthenticated, loading, signOut } = useAuthentication(apiUrl);
  const url = githubLoginUrl(clientId, scopes);

  /**
   * Function to handle the sign-in action.
   */
  const signIn = (): void => {
    window.open(url, "_self");
  };

  return isAuthenticated === false ? (
    <button onClick={signIn} className={classNames?.signInButton} disabled={loading}>
      {loading ? "Loading..." : "Sign In"}
    </button>
  ) : (
    <button onClick={signOut} className={classNames?.signOutButton}>
      Sign Out
    </button>
  );
};

export default SignInButton;
