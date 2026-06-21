const { GraphQLError } = require("graphql");

const Author = require("./models/author");
const Book = require("./models/book");

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
    // allBooks: async (root, args) => {
    //   let bookList = await Book.find({}).populate('author')
    //   if(args.author)
    //     bookList = bookList.filter(book => book.author.name === args.author)
    //   if(args.genre)
    //     bookList = bookList.filter(book => book.genres.includes(args.genre))
    //   return bookList
    // },
    allAuthors: () => Author.find({}).exec(),
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
    addBook: async (root, args) => {
      const bookExist = await Book.find({ title: args.title });
      if (bookExist.length) {
        throw new GraphQLError("Title must be unique", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }
      const newBook = new Book({ ...args });
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
    addAuthor: async (root, args) => {
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
    editAuthor: async (root, args) => {
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
  },
};

module.exports = resolvers;
