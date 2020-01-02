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

const GET_ISSUES_OF_REPOSITORY = `
  query ($organization: String!, $repository: String!) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        name
        url
        issues(last: 5, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
            }
          }
        }
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
    fetchFromGitHub();
  };

  const onChange = e => setPath(e.target.value);

  useEffect(() =>{
    fetchFromGitHub();
  }, []);

  const fetchFromGitHub = () => {
    const [organizationLogin, repositoryName] = path.split('/');

    setOrganization(null);
    setErrors(null);
    axiosGitHubGraphQL
      .post('', {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization: organizationLogin, repository: repositoryName }
      })
      .then(result => {
        if (result.data.errors)
          setErrors(result.data.errors);
        else
          setOrganization(result.data.data.organization);
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
      
      {(organization || errors) ? (
        <Organization organization={organization} errors={errors} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
}

export default App;
