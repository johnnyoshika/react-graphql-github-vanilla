import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Organization from './Organization';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  }
});

const TITLE = 'React GraphQL GitHub Client';

const GET_REPOSITORY_OF_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
      repository(name: "the-road-to-learn-react") {
        name
        url
      }
    }
  }
`;

function App() {
  const [path, setPath] = useState('the-road-to-learn-react/the-road-to-learn-react');
  const [organization, setOrganization] = useState(null);
  const [errors, setErrors] = useState(null);

  const onSubmit = e => {
    e.preventDefault();
  };

  const onChange = e => setPath(e.target.value);

  useEffect(() =>{
    fetchFromGitHub();
  }, []);

  const fetchFromGitHub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_REPOSITORY_OF_ORGANIZATION})
      .then(result => {
        setOrganization(result.data.data.organization);
        setErrors(result.data.errors);
      });
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
      
      {organization ? (
        <Organization organization={organization} errors={errors} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
}

export default App;
