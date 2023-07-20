const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const routes = require('./routes');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// server.applyMiddleware({ app });
// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
  });
});

