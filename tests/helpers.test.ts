import { TOKEN_KEY } from "../src/const";
import { getTokenFromLS, setTokenToLS, removeTokenFromLS, githubLoginUrl } from "../src/helpers"; // Replace "yourModule" with the actual module name

describe("getTokenFromLS", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("returns null if token is not set in localStorage", () => {
    expect(getTokenFromLS()).toBeNull();
  });

  test("returns the token value if set in localStorage", () => {
    const token = "exampleToken";
    localStorage.setItem(TOKEN_KEY, token);
    expect(getTokenFromLS()).toBe(token);
  });
});

describe("setTokenToLS", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("sets the token value in localStorage", () => {
    const token = "exampleToken";
    setTokenToLS(token);
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token);
  });
});

describe("removeTokenFromLS", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("removes the token from localStorage", () => {
    localStorage.setItem("TOKEN_KEY", "exampleToken");
    removeTokenFromLS();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });
});

describe("githubLoginUrl", () => {
  test("returns the correct login URL without additional scopes", () => {
    const clientID = "yourClientID";
    const expectedUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&state=%7B%22prevPath%22%3A%22%2F%22%7D&scope=project+repo`;
    expect(githubLoginUrl(clientID)).toBe(expectedUrl);
  });

  test("returns the correct login URL with additional scopes", () => {
    const clientID = "yourClientID";
    const scopes = ["user", "read:org"];
    const expectedUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&state=%7B%22prevPath%22%3A%22%2F%22%7D&scope=project+repo+user+read%3Aorg`;
    expect(githubLoginUrl(clientID, scopes)).toBe(expectedUrl);
  });
});
