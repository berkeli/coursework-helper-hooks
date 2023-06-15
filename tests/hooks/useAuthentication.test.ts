import { act, renderHook } from "@testing-library/react";
import useAuthentication from "../../src/hooks/useAuthentication";
import * as helpers from "../../src/helpers";

describe("useAuthentication", () => {
  const apiURL = "https://example.com/api";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with token, loading, error, and isAuthenticated values", async () => {
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValue("exampleToken");
    const { result } = renderHook(() => useAuthentication(apiURL));

    expect(result.current.token).toBe("exampleToken");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isAuthenticated).toBe(true);
  });

  test("handles authentication flow and sets token on successful response", async () => {
    const code = "exampleCode";
    const token = "exampleToken";
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValue(null);

    jest.spyOn(URLSearchParams.prototype, "get").mockImplementation((key) => (key === "code" ? "exampleCode" : null));

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            token,
          }),
      })
    ) as jest.Mock;

    global.fetch = mockFetch;

    let hook: unknown;

    await act(async () => {
      hook = renderHook(() => useAuthentication(apiURL));
    });
    const { result } = hook as { result: { current: ReturnType<typeof useAuthentication> } };

    expect(mockFetch).toHaveBeenCalledWith(`${apiURL}/auth?code=${code}`, {
      method: "POST",
    });
    expect(result.current.token).toBe(token);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test("handles authentication flow and sets error on unsuccessful response", async () => {
    const code = "exampleCode";
    const error = "Example error";

    jest.spyOn(URLSearchParams.prototype, "get").mockImplementation((key) => (key === "code" ? "exampleCode" : null));

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error,
          }),
      })
    ) as jest.Mock;

    global.fetch = mockFetch;

    let hook: unknown;

    await act(async () => {
      hook = renderHook(() => useAuthentication(apiURL));
    });
    const { result } = hook as { result: { current: ReturnType<typeof useAuthentication> } };

    expect(mockFetch).toHaveBeenCalledWith(`${apiURL}/auth?code=${code}`, {
      method: "POST",
    });

    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
  });

  test("signs out and removes token from localStorage", async () => {
    let hook: unknown;
    await act(async () => {
      hook = renderHook(() => useAuthentication(apiURL));
    });
    const { result } = hook as { result: { current: ReturnType<typeof useAuthentication> } };

    await act(async () => {
      result.current.signOut();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
