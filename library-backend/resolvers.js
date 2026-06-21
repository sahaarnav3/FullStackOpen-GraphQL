const { GraphQLError, GraphQLBoolean } = require("graphql");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre)
        return Book.find({ genres: args.genre })
          .populate({
            path: "author",
            match: { name: args.author },
          })
          .exec()
          .then((books) => books.filter((book) => book.author !== null));
      if (args.author)
        return Book.find()
          .populate({
            path: "author",
            match: { name: args.author },
          })
          .exec()
          .then((books) => books.filter((book) => book.author !== null));
      if (args.genre) return Book.find({ genres: args.genre }).exec();
      return Book.find({}).populate("author").exec();
    },
    allAuthors: () => Author.find({}).exec(),
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: (root) => Book.countDocuments({ author: root._id }).exec(),
  },
  Book: {
    author: async (root) => {
      const authorDetails = await Author.findById(root.author);
      return authorDetails;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });

      const bookExist = await Book.find({ title: args.title });
      if (bookExist.length) {
        throw new GraphQLError("Title must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author });
        const authorResponse = await newAuthor.save();
        if (!authorResponse)
          throw new GraphQLError(
            `Author not found in DB. And creating new Author failed. Try Again`,
            {
              extensions: {
                code: "AUTHOR_CREATION_ERROR",
                error,
              },
            },
          );
        author = authorResponse;
      }
      const newBook = new Book({ ...args, author: author._id });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError(`Saving Book Failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }
      return newBook;
    },
    addAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });

      const authorExist = await Author.find({ name: args.name });
      if (authorExist.length) {
        throw new GraphQLError("Author must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      if (args.name.length < 4) {
        throw new GraphQLError("Author name must have minimum 4 characters", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const newAuthor = new Author({ ...args });
      try {
        await newAuthor.save();
      } catch (error) {
        throw new GraphQLError(`Saving Author Failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
      return newAuthor;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser)
        throw new GraphQLError("Not Authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });

      let author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError(`Saving Born Year Failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong Credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async (root, args, context) => {
      if (process.env.NODE_ENV !== "test")
        throw new GraphQLError(
          "_resetDatabase is only available in test mode.",
        );

      await Author.deleteMany([]);
      await Book.deleteMany([]);
      await User.deleteMany([]);
      return true;
    },
  },
};

module.exports = resolvers;
