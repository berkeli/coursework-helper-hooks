import { renderHook, act } from "@testing-library/react";
import useIssues from "../../src/hooks/useIssues";

describe("useIssues", () => {
  const mockData = {
    issues: [
      {
        number: 1,
      },
    ],
  };
  const mockApiURL = "https://example.com/api";
  const mockModule = "example-module";

  beforeEach(() => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockData),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch issues and return data, loading, and error states", async () => {

    let hook: unknown;

    await act(async () => {
      hook =renderHook(() => useIssues(mockApiURL, mockModule));
    });

    const { result } = hook as { result: { current: ReturnType<typeof useIssues> } };

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should set error state when API returns an error", async () => {
    const mockErrorMessage = "API error message";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: mockErrorMessage }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useIssues(mockApiURL, mockModule));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMessage);
  });

  it("should set error state request is rejected", async () => {
    const mockErrorMessage = "API error message";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(new Error(mockErrorMessage)),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useIssues(mockApiURL, mockModule));

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMessage);
  });

  it("should refetch data when reFetch function is called", async () => {
    const { result } = renderHook(() => useIssues(mockApiURL, mockModule));

    const newData = {
      issues: [{ number: 2 }],
    };
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(newData),
      })
    ) as jest.Mock;

    act(() => {
      result.current.reFetch();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.data).toEqual(newData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });
});
