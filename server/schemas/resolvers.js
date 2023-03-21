const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
          const userData = await User
              .findOne({ _id: context.user._id })
              .select("-__v -password")
              .populate("books");
          
          return userData;
      };
      throw new AuthenticationError("You must be logged in!");
  },
}, 


  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect email or password");
      }

      // Check if the password is correct
      const isValidPassword = await user.checkPassword(password);
      if (!isValidPassword) {
        throw new AuthenticationError("Incorrect email or password");
      }

      // Sign a JWT token with the user's ID and email
      const token = signToken({ id: user._id, email });

      // Return the token and user data
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
          const updatedUser = await User
              .findOneAndUpdate(
                  { _id: context.user._id }, 
                  { $addToSet: { savedBooks: bookData } },
                  { new: true },
              )
              .populate("books");
          return updatedUser;
      };
      throw new AuthenticationError("You must be logged in to save books!");
  },

  removeBook: async (parent, { bookId }, context) => {
    if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId } } },
            { new: true },
        );
        return updatedUser;
    };
    throw new AuthenticationError("You must be logged in to delete books!");
},
  },
};

module.exports = resolvers;
