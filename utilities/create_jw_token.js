import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwt = jsonwebtoken;

const create_jw_token = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

export default create_jw_token; 