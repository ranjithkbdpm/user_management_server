import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwt = jsonwebtoken;

const create_jw_token = (id) => {
  return jwt.sign(
    { id }, 
    process.env.TOKEN_KEY, 
    {expiresIn: 3 * 24 * 60 * 60}
  );
};

const create_jw_access_token = (id, expiringTime) => {
  return jwt.sign(
    { id }, 
    process.env.ACCESS_TOKEN_SECRETEKEY, 
    {expiresIn: expiringTime}
  );
};

const create_jw_refresh_token = (id, expiringTime) => {
  return jwt.sign(
    { id }, 
    process.env.REFRESH_TOKEN_SECRETEKEY, 
    {expiresIn: expiringTime}
  );
};

const verify_jwt_refreshtoken = (token,) =>{

}

const verify_jwt_accesstoken = (token,) =>{

}

export {
  create_jw_token,
  create_jw_access_token,
  create_jw_refresh_token,
  verify_jwt_refreshtoken,
  verify_jwt_accesstoken  
};
