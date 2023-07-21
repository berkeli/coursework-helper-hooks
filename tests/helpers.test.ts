import { TOKEN_KEY } from "../src/const";
import { getTokenFromLS, setTokenToLS, removeTokenFromLS, githubLoginUrl, cloneIssue } from "../src/helpers";

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

describe("cloneIssue", () => {
  const apiURL = "https://example.com/api";
  const token = "your-token";
  const module = "your-module";
  const sprint = "your-sprint";
  const issue = 123;

  const mockFetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          token,
        }),
    })
  ) as jest.Mock;

  global.fetch = mockFetch;

  afterEach(() => {
    mockFetch.mockClear(); // Clear the mock after each test
  });

  it("should construct the correct URL without issue number", async () => {
    expect(() => cloneIssue(apiURL, token, module)).not.toThrowError();

    expect(mockFetch).toHaveBeenCalledWith(new URL(`${apiURL}/github/clone/${module}`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("should construct the correct URL with issue number", async () => {
    await cloneIssue(apiURL, token, module, undefined, issue);

    expect(mockFetch).toHaveBeenCalledWith(new URL(`${apiURL}/github/clone/${module}/${issue}`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("should append the sprint parameter to the URL", async () => {
    await cloneIssue(apiURL, token, module, sprint);

    const expectedURL = new URL(`${apiURL}/github/clone/${module}`);
    expectedURL.searchParams.append("sprint", sprint);

    expect(mockFetch).toHaveBeenCalledWith(expectedURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("should throw an error if the response contains an error property", async () => {
    const errorResponse = { error: "Something went wrong" };
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve(errorResponse) });

    await expect(cloneIssue(apiURL, token, module)).rejects.toThrowError("Something went wrong");
  });

  it("should return the data if no error occurred", async () => {
    const responseData = { id: 1, title: "Test Issue" };
    mockFetch.mockResolvedValueOnce({ json: () => Promise.resolve(responseData) });

    const result = await cloneIssue(apiURL, token, module);

    expect(result).toEqual(responseData);
  });
});
