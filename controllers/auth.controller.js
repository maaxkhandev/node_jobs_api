const User = require("../models/User.model");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const { UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: {
      user_id: user._id,
      name: user.name,
      email: user.email,
    },
    token: token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT(); // Call the method on the user instance

  res.status(StatusCodes.OK).json({
    user: { userId: user._id, name: user.name, email: user.email },
    token: token,
  });
};

module.exports = {
  register,
  login,
};
