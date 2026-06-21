const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith("Bearer ")) return null;

  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
  return User.findById(decodedToken.id)
};

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async({ req }) => {
      const authToken = req.headers.authorization;
      const currentUser = await getUserFromAuthHeader(authToken)
      return { currentUser }
    }
  }).then(({ url }) => {
    console.log(`Server Ready at ${url}`);
  });
};

module.exports = startServer;
