import React from 'react';
import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const TITLE = 'React GraphQL GitHub Client';

function App() {
  return (
    <div>
      <h1>{TITLE}</h1>
    </div>
  );
}

export default App;
