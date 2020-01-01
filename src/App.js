import React, { useState, useEffect } from 'react';
import axios from 'axios';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const TITLE = 'React GraphQL GitHub Client';

const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

function App() {
  const [path, setPath] = useState('the-road-to-learn-react/the-road-to-learn-react');

  const onSubmit = e => {
    e.preventDefault();
  };

  const onChange = e => setPath(e.target.value);

  useEffect(() =>{
    fetchFromGitHub();
  }, []);

  const fetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_ORGANIZATION})
      .then(result => console.log(result));
  };

  return (
    <div>
      <h1>{TITLE}</h1>

      <form onSubmit={onSubmit}>
        <label htmlFor="url">
          Show open issues for https://github.com/
        </label>
        <input id="url" type="text" value={path} onChange={onChange} style={{width: '300px'}} />
        <button type="submit">Search</button>
      </form>
      <hr />

    </div>
  );
}

export default App;
