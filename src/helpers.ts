import { TOKEN_KEY } from "./const";

/**
 * Retrieve the access token from the localStorage.
 * @returns The access token stored in localStorage.
 */
export const getTokenFromLS = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store the access token in the localStorage.
 * @param token - The access token to be stored.
 */
export const setTokenToLS = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the access token from the localStorage.
 */
export const removeTokenFromLS = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Generate the GitHub login URL with the provided client ID and optional scopes.
 * @param clientID - The client ID for GitHub OAuth.
 * @param scopes - Optional. An array of scopes to request during login.
 * @returns The generated GitHub login URL.
 */
export const githubLoginUrl = (clientID: string, scopes?: string[]): string => {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.append("client_id", clientID);
  url.searchParams.append("state", JSON.stringify({ prevPath: location.pathname }));
  url.searchParams.append("scope", ["project", "repo"].concat(scopes || []).join(" "));
  return url.toString();
};

export async function cloneIssue(apiURL: string, token: string, module: string, sprint?: string, issue?: number) {
  // Construct the URL based on the provided module and optional issue number
  const url = issue ? new URL(`${apiURL}/github/clone/${module}/${issue}`) : new URL(`${apiURL}/github/clone/${module}`);

  // If a sprint parameter is provided, append it to the URL's search parameters
  if (sprint) {
    url.searchParams.append("sprint", sprint);
  }

  // Make a POST request to the constructed URL with the required headers
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json()) // Parse the response as JSON
    .then((data) => {
      if (data.error) {
        throw new Error(data.error); // Throw an error if the response contains an error property
      }
      return data; // Return the data if no error occurred
    });
}
