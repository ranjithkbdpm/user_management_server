import User from "../users/UserModel.js";
import Role from "../role/RoleModel.js";
import {
  create_jw_access_token,
  create_jw_refresh_token,
} from "../../utilities/jwt.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      phonenumber,
      password,
      createdAt,
      role,
    } = req.body;
    let userRole = role;
    if (!userRole) {
      const defaultRole = await Role.findOne({ role: "user" });
      if (!defaultRole) {
        const createdRole = await Role.create({ role: "user" });
        userRole = createdRole._id;
      } else {
        userRole = defaultRole._id;
      }
    } else {
      const existingRole = await Role.findOne({ role: userRole });
      if (!existingRole) {
        const createdRole = await Role.create({ role: userRole });
        userRole = createdRole._id;
      } else {
        userRole = existingRole._id;
      }
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exist" });
    } else {
      const user = await User.create({
        firstname,
        lastname,
        username,
        email,
        phonenumber,
        password,
        createdAt,
        role: userRole,
      });
      const userInfo = {
        username,
        email,
        role,
        name: firstname + " " + lastname,
        phonenumber,
      };
      res
        .status(201)
        .json({
          success: true,
          message: "User created successfully",
          userInfo,
        });
    }
  } catch (err) {
    console.log("signUp controller error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Enter email address" });
    }
    if (!password) {
      return res.json({ success: false, message: "Enter password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res.json({ success: false, message: "Password is incorrect" });
    } else {
      const accessToken = create_jw_access_token(user._id, "30s");
      const refreshToken = create_jw_refresh_token(user._id, "1d");

      // store refresh token in the database. this helps in validation
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie("refresh_token", refreshToken, {
        withCredentials: true,
        // secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "login successfully", success: true, accessToken });
    }
  } catch (err) {
    console.log("login controller error", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
