import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignInButton from "../../src/components/SignInButton";
import * as helpers from "../../src/helpers";

describe("SignInButton", () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "open");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the sign-in button", () => {
    const { getByText } = render(<SignInButton clientId="" apiUrl="" />);
    expect(getByText("Sign In")).toBeInTheDocument();
  });

  it("redirects to github when the sign-in button is clicked", () => {
    const { getByText } = render(<SignInButton clientId="123" apiUrl="https://example.com" />);

    windowSpy.mockImplementationOnce(jest.fn());

    const signInButton = getByText("Sign In");

    fireEvent.click(signInButton);
    expect(windowSpy).toHaveBeenCalled();
    // we don't care about state, but verify base URL, client ID and scope
    expect(windowSpy).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/github\.com\/login\/oauth\/authorize\?client_id=\d+&state=.*&scope=project\+repo$/), "_self");
  });

  it("renders loading when loading is true", async () => {
    jest.spyOn(URLSearchParams.prototype, "get").mockImplementationOnce((key) => (key === "code" ? "exampleCode" : null));

    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            token: "exampleToken",
          }),
      })
    ) as jest.Mock;

    global.fetch = mockFetch;

    const { getByText } = render(<SignInButton clientId="123" apiUrl="http://example.com" />);

    await waitFor(() => {
      expect(getByText("Loading...")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith("http://example.com/auth?code=exampleCode", {
      method: "POST",
    });
  });

  it("renders sign out when authenticated", () => {
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValueOnce("exampleToken");
    const { getByText } = render(<SignInButton clientId="" apiUrl="" />);

    expect(getByText("Sign Out")).toBeInTheDocument();
  });

  it("signs out when the sign out button is clicked", () => {
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValueOnce("exampleToken");
    jest.spyOn(helpers, "removeTokenFromLS");
    const { getByText } = render(<SignInButton clientId="" apiUrl="" />);

    const signOutButton = getByText("Sign Out");

    fireEvent.click(signOutButton);
    expect(helpers.removeTokenFromLS).toHaveBeenCalled();
  });

  it("applies additional class names to the sign-in", async () => {
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValueOnce(null);
    const { getByText } = render(<SignInButton clientId="123" apiUrl="https://example.com" classNames={{ signInButton: "custom-sign-in" }} />);

    await waitFor(() => {
      const signInButton = getByText("Sign In");
      expect(signInButton.classList.contains("custom-sign-in")).toBe(true);
    });
  });

  it("applies additional class names to the sign-out", async () => {
    jest.spyOn(helpers, "getTokenFromLS").mockReturnValue("exampleToken");
    const { getByText } = render(<SignInButton clientId="123" apiUrl="https://example.com" classNames={{ signOutButton: "custom-sign-out" }} />);

    await waitFor(() => {
      const signInButton = getByText("Sign Out");
      expect(signInButton.classList.contains("custom-sign-out")).toBe(true);
    });
  });
});
