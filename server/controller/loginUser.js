const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => { 
    try {
        const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
      });
    }

    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "Invalid password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successful",
      data: user,
      token,
      // data: {
      //   _id: user._id,
      //   name: user.name,
      //   email: user.email,
      //   // profile_pic: user.profile_pic,
      //   createdAt: user.createdAt,
      //   updatedAt: user.updatedAt,
      //   token: token
      // },
      success: true,
    });
    

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
          });
    }
}

module.exports = loginUser