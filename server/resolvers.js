const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const resolvers = {
  Query: {
    books: async (_, { searchTerm }) => {
      try {
        const apiKey = 'AIzaSyDTC9EtxZcN58t03WGCtK_KHfkFzKX9oNo';
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchTerm
        )}&key=${apiKey}`;
        const response = await axios.get(apiUrl);
        const books = response.data.items.map((item) => {
          return {
            id: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
            description: item.volumeInfo.description,
            // Add more fields as needed
          };
        });

        return books;
      } catch (error) {
        console.error('Error fetching book data:', error);
        throw new Error('Failed to fetch book data. Please try again later.');
      }
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password');
        return userData;
      }
    
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    // saveBook: (_, { title, author, description }) => {
    //   const newBook = { id: String(books.length + 1), title, author, description };
    //   books.push(newBook);
    //   return newBook;
    // },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { input }, { user }) => {
      if (user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, { bookId }, { user }) => {
      if (user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true, runValidators: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError("You have to be logged in!");
    }
  },
};

module.exports = resolvers;
