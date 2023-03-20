const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // find current user and return userData
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      // create new user, sign token, return token and user data
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
    saveBook: async (parent, args, context) => {
      // protect route, find current user, update their savedBooks array, return user data
    },
    removeBook: async (parent, args, context) => {
      // protect route, find current user, update their savedBooks array, return user data
    },
  },
};

module.exports = resolvers;
