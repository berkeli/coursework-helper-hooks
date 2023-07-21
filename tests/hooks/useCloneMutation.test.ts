import { renderHook, act } from "@testing-library/react";
import useCloneMutation from "../../src/hooks/useCloneMutation";

describe("useCloneButton", () => {
  const mockApiURL = "https://example.com/api";
  const mockToken = "example-token";
  const mockModule = "example-module";
  const mockSprint = "example-sprint";
  const mockIssue = 1;

  beforeEach(() => {
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should clone without issue and return loading, error, and success states", async () => {
    const { result } = renderHook(() => useCloneMutation(mockApiURL, mockToken, mockModule, mockSprint, mockIssue));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.success).toBeNull();

    await act(async () => {
      result.current.clone();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.success).not.toBeNull();
  });

  it("should clone with issue and return loading, error, and success states", async () => {
    const { result } = renderHook(() => useCloneMutation(mockApiURL, mockToken, mockModule, mockSprint, mockIssue));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.success).toBeNull();

    act(() => {
      result.current.clone();
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.success).toBeNull();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.success).not.toBeNull();
  });

  it("should set error state when API returns an error", async () => {
    const mockErrorMessage = "API error message";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: mockErrorMessage }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useCloneMutation(mockApiURL, mockToken, mockModule));

    await act(async () => {
      result.current.clone();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMessage);
    expect(result.current.success).toBeNull();
  });

  it("should set error state when request is rejected", async () => {
    const mockErrorMessage = "Request rejected";
    global.fetch = jest.fn(() => Promise.reject(new Error(mockErrorMessage)));

    const { result } = renderHook(() => useCloneMutation(mockApiURL, mockToken, mockModule));

    await act(async () => {
      result.current.clone();
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockErrorMessage);
    expect(result.current.success).toBeNull();
  });
});
