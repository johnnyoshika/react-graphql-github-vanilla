Experiment with GraphQL without a GraphQL client library, following the tutorial here: https://www.robinwieruch.de/react-with-graphql-tutorial. Similar tutorial is also available in the same author's **Road to GraphQL** ebook: https://roadtoreact.com/course-details?courseId=THE_ROAD_TO_GRAPHQL.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup
* Clone this repo.
* Create an `.env` file in the root of this project and set its content to the following, where `access_token` is generated from: https://github.com/settings/tokens. Grant the permissions listed here for the token: https://www.robinwieruch.de/getting-started-github-graphql-api
```
REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN=access_token
```
* `npm install`

## Run

* Use Node version 8+ (e.g. 8.17.0).
* `npm start`
* Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
