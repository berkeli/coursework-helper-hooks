import { TOKEN_KEY } from "./const";

export const getTokenFromLS = () => localStorage.getItem(TOKEN_KEY);
export const setTokenToLS = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeTokenFromLS = () => localStorage.removeItem(TOKEN_KEY);

export const githubLoginUrl = (clientID: string, scopes?: string[]): string => {
  const qs = new URLSearchParams({
    client_id: clientID,
    state: JSON.stringify({
      prevPath: location.pathname,
    }),
    scope: ["project", "repo"].concat(scopes || []).join(" "),
  });

  return `https://github.com/login/oauth/authorize?${qs}`;
};
