# Collection of utils for coursework-helper

The repository contains a collection of utils for interacting with [coursework-helper backend](https://github.com/berkeli/coursework-helper).

## Usage

### npm
```bash
npm install coursework-helper-ui
```
### yarn
```bash
yarn add coursework-helper-ui
```

## Components
### RedirectWithTimeout
Redirects to the specified path after the specified timeout.
```jsx
import {RedirectWithTimeout} from 'coursework-helper-ui';

const MyComponent = () => {
  return (
    <div>
      {/* Redirect to "/dashboard" after 5 seconds */}
      <RedirectWithTimeout to="/dashboard" timeoutSeconds={5} />
    </div>
  );
};

```
### SignInButton
Sign in button for Github OAuth. The button uses useAuthentication hook internally.
```jsx
import { SignInButton } from 'coursework-helper-ui';

const MyComponent = () => {
  // Replace 'YOUR_CLIENT_ID' and 'YOUR_API_URL' with your actual values
  const clientId = 'YOUR_CLIENT_ID';
  const apiUrl = 'YOUR_API_URL';

  // Optionally, you can define additional scopes for GitHub OAuth
  const scopes = ['user', 'public_repo'];

  return (
    <div>
      {/* Render the sign-in button with custom class names */}
      <SignInButton
        clientId={clientId}
        apiUrl={apiUrl}
        scopes={['user', 'read:org']}
        classNames={{
          signInButton: 'custom-sign-in-btn',
          signOutButton: 'custom-sign-out-btn',
        }}
      />
    </div>
  );
};
```

## Hooks
### useAuthentication
The `useAuthentication` hook is a custom React hook that facilitates handling authentication for your application. It allows you to manage the user's authentication state, store authentication tokens in local storage, and perform the authentication process with an API.

This hook must also be present on `/auth` page of your application. It will handle the authentication process and redirect the user back to the application. 

```jsx
import { useAuthentication } from 'coursework-helper-ui';

const MyComponent = () => {
  const apiURL = 'YOUR_API_URL';
  const { token, loading, error, isAuthenticated, signOut, redirectPath } = useAuthentication(apiURL);

  return (
    <div>
      {loading ? <div>Loading...</div> : null}

      {isAuthenticated ? (
        <>
          <div>Welcome, User!</div>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <div>Please sign in</div>
      )}

      {error && <div>Error: {error}</div>}
    </div>
  );
};
```
### useCloneMutation
The `useCloneMutation` hook is a custom React hook that facilitates cloning issues from GitHub. It allows you to manage the cloning state and perform the cloning process with an API. It

```jsx
import { useCloneMutation } from 'coursework-helper-ui';

const CloneButton = () => {
  const apiURL = 'YOUR_API_URL';
  const accessToken = 'YOUR_ACCESS_TOKEN';
  const module = 'YOUR_MODULE_NAME'; // this is github repo name
  const sprint = 'YOUR_SPRINT_NAME'; // Optional: Omit if not required
  const issueNumber = 1234; // Optional: Omit if not required

  const { loading, error, success, clone } = useCloneMutation(apiURL, accessToken, module, sprint, issueNumber);

  return (
    <div>
      <button onClick={clone} disabled={loading}>
        {loading ? 'Cloning...' : 'Clone Issue'}
      </button>

      {error && <div>Error: {error}</div>}

      {success && <div>{success.total} issues cloned!</div>}
    </div>
  );
};
```

### useIssues
The `useIssues` hook is a custom React hook that facilitates fetching issues from GitHub. It allows you to manage the issues state and perform the fetching process with an API. It

```jsx
import { useIssues } from 'coursework-helper-ui';

const YourComponent = () => {
  const apiURL = ''; // Replace with your API base URL
  const module = 'your-repo-name'; // Replace with the name of your module/repository

  const { data, loading, error, reFetch } = useIssues(apiURL, module);

  // Your component logic using the fetched data, loading, and error states
};
```

## Functions
### cloneIssue
This function is used to clone GitHub issues from a specified module/repository using the GitHub API. It allows cloning a specific issue or cloning all issues related to a sprint, if the sprint parameter is provided.

```jsx
import { cloneIssue } from 'coursework-helper-ui';

const apiURL = "https://api.example.com";
const token = "YOUR_GITHUB_API_TOKEN";
const module = "example-module";
const issueNumber = 42;
const sprintName = "Sprint 1";

cloneIssue(apiURL, token, module, sprintName, issueNumber)
  .then((data) => {
    console.log("Successfully cloned issue:", data);
  })
  .catch((error) => {
    console.error("Error cloning issue:", error.message);
  });
```