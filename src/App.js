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
  query ($organization: String!, $repository: String!, $cursor: String) {
    organization(login: $organization) {
      name
      url
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(first: 5, after: $cursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              reactions(last: 3) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input:{
      starrableId: $repositoryId
    }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input:{
      starrableId: $repositoryId
    }) {
      starrable {
        viewerHasStarred
      }
    }
  }
`;

const resolveIssuesQuery = (organization, queryResult, cursor) => {
  const { data } = queryResult.data;

  if (!cursor)
    return data.organization;

  const { edges: oldIssues } = organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    ...data.organization,
    repository: {
      ...data.organization.repository,
      issues: {
        ...data.organization.repository.issues,
        edges: updatedIssues,
      }
    }
  };
};

const resolveStarMutation = (organization, viewerHasStarred) => {
  const { totalCount } = organization.repository.stargazers;
  return {
    ...organization,
    repository: {
      ...organization.repository,
      viewerHasStarred,
      stargazers: {
        totalCount: totalCount + (viewerHasStarred ? 1 : -1)
      }
    }
  };
};

const addStarToRepository = repositoryId => axiosGitHubGraphQL.post('', {
  query: ADD_STAR,
  variables: { repositoryId }
});

const removeStarFromRepository = repositoryId => axiosGitHubGraphQL.post('', {
  query: REMOVE_STAR,
  variables: { repositoryId }
});

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

  const fetchFromGitHub = (cursor) => {
    const [organizationLogin, repositoryName] = path.split('/');

    setErrors(null);
    axiosGitHubGraphQL
      .post('', {
        query: GET_ISSUES_OF_REPOSITORY,
        variables: { organization: organizationLogin, repository: repositoryName, cursor }
      })
      .then(result => {
        if (result.data.errors)
          setErrors(result.data.errors);
        else
          setOrganization(resolveIssuesQuery(organization, result, cursor));
      });
  };

  const onFetchMoreIssues = () => {
    const { endCursor } = organization.repository.issues.pageInfo;
    fetchFromGitHub(endCursor);
  };

  const onStarRepository = (repositoryId, viewerHasStarred) => viewerHasStarred
    ? removeStarFromRepository(repositoryId).then(mutationResult =>
        setOrganization(resolveStarMutation(organization, mutationResult.data.data.removeStar.starrable.viewerHasStarred)))
    : addStarToRepository(repositoryId).then(mutationResult =>
        setOrganization(resolveStarMutation(organization, mutationResult.data.data.addStar.starrable.viewerHasStarred)));

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
        <Organization
          organization={organization}
          errors={errors}
          onFetchMoreIssues={onFetchMoreIssues}
          onStarRepository={onStarRepository} />
      ) : (
        <p>No information yet...</p>
      )}
    </div>
  );
}

export default App;
