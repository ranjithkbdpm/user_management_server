// import jsonwebtoken from "jsonwebtoken";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// const jwt = jsonwebtoken;

const create_jw_token = (userId) => {
  return jwt.sign(
    { id }, 
    process.env.TOKEN_KEY, 
    {expiresIn: 3 * 24 * 60 * 60}
  );
};

const create_jw_access_token = (userId, expiringTime) => {
  return jwt.sign(
    { id: userId }, 
    process.env.ACCESS_TOKEN_SECRETEKEY, 
    {expiresIn: expiringTime}
  );
};

const create_jw_refresh_token = (userId, expiringTime) => {
  return jwt.sign(
    { id: userId }, 
    process.env.REFRESH_TOKEN_SECRETEKEY, 
    {expiresIn: expiringTime}
  );
};

const verify_jwt_refreshtoken = (token) =>{
  return jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRETEKEY
  );
}

const verify_jwt_accesstoken = (token) =>{
  return jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRETEKEY
  );
}

export {
  create_jw_token,
  create_jw_access_token,
  create_jw_refresh_token,
  verify_jwt_refreshtoken,
  verify_jwt_accesstoken  
};
