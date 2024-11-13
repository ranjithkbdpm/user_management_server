import User from "../users/UserModel.js";
import Role from "../role/RoleModel.js";
import { create_jw_access_token, create_jw_refresh_token} from "../../utilities/jwt.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  try {
    const {firstname,lastname,username,email,phonenumber,password,createdAt, role,} = req.body;
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
      const role = user.role;
      
      // store refresh token in the database. this helps in validation
      user.refreshToken = refreshToken;
      await user.save().then(() => console.log("Refresh token saved")).catch(err => console.error("Error saving refresh token:", err));

      res.cookie("refresh_token", refreshToken, {
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: 'None',
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: "login successfully", success: true, accessToken, role, user});
    }
  } catch (err) {
    console.log("login controller error", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const logout = async(req,res) => {
  // Only refresh token is deleted at the backend access token is deleted at the front end 
  const cookies = req.cookies;

  if(!cookies?.refresh_token) return res.sendStatus(401);

  const refreshToken = cookies.refresh_token;
    // console.log('refresh_token from cookies:',refreshToken);
  const user = await User.findOne({ refreshToken });
  // if there is a cookie with token but no user with same token
  if(!user) {
    res.clearCookie('refresh_token', { 
      // secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
    return res.sendStatus(204);
  }
  // if there is user with refresh token delete the token from database
  user.refreshToken = null;
  await user.save().then(() => console.log("Refresh token removed for user db")).catch(err => console.error("Error changing refresh token:", err));

  res.clearCookie('refresh_token', { 
    // secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  return res.sendStatus(204);  
}




