import User from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// generating ACCESS AND REFRESH TOKEN ...

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "ERROR :: WHILE GENERATING ACCESS AND REFRESH TOKEN :: ",
      error
    );
  }
};

// Registering the user...

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All field are required");
    }
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ApiError(404, "User is exist already");
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    if (!user) {
      throw new ApiError(500, "User is not created");
    }
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    console.log("ERROR ");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!username && !email) {
      throw new ApiError(400, "username or email is require");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            refreshToken,
            accessToken,
          },
          "user logged in successfully"
        )
      );
  } catch (error) {
    console.log("ERROR :: WHILE LOGGING USER :: ", error);
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
  } catch (error) {
    console.log("ERROR :: WHILE LOGING OUT USER :: ", error);
  }
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "Current User fetched"));
};

export { registerUser, loginUser, logoutUser, getCurrentUser };
