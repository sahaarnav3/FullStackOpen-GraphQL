const typeDefs = /* GraphQL */ `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: ID!
      published: Int!
      genres: [String!]!
    ): Book

    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

module.exports = typeDefs;
