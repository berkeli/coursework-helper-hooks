import { TOKEN_KEY } from "./const";

export const getTokenFromLS = () => localStorage.getItem(TOKEN_KEY);
export const setTokenToLS = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeTokenFromLS = () => localStorage.removeItem(TOKEN_KEY);

export const githubLoginUrl = (clientID: string, scopes?: string[]): string => {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.append("client_id", clientID);
  url.searchParams.append("state", JSON.stringify({ prevPath: location.pathname }));
  url.searchParams.append("scope", ["project", "repo"].concat(scopes || []).join(" "));
  return url.toString();
};
