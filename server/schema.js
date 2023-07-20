const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  id: ID!
  username: String!
  email: String!
  password: String!
  token: String
}

  type Book {
    id: ID!
    title: String!
    author: String
    description: String
    # Add more fields as needed
  }

  type Query {
    books(searchTerm: String!): [Book]
    me: User
  }

    type Mutation {
      login(email: String!, password: String!): Auth
      addUser(username: String!, email: String!, password: String!): Auth
      saveBook(input: bookInput): User
      removeBook(bookId: ID!): User
  }

  input bookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
