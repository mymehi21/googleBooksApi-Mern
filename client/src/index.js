import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql', // Replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
