import User from "../users/UserModel.js";
import { verify_jwt_refreshtoken, create_jw_access_token } from "../../utilities/jwt.js";

// This handler function is to provide access token by handling refresh token instead of login each time on expiration of access token that has been sent during login

const handleRefreshToken = async(req, res)=>{
    const cookies = req.cookies;
    // console.log('cookies',cookies);
    if(!cookies?.refresh_token) 
        return res.status(401).json({ success: false, message: 'Unauthorised : Cookie is missing'});

    const refreshToken = cookies.refresh_token;
    // console.log('refresh_token from cookies:',refreshToken);

    const user = await User.findOne({ refreshToken });
    // console.log('user',user)
    
    if(!user) return res.status(403).json({ success: false, message: 'Forbidden: No refresh token provided cannot access further'});

    // verify refresh token with secret key
    try {
        const decoded = verify_jwt_refreshtoken(refreshToken);
        // console.log(typeof user.firstname,typeof user._id, typeof decoded.id) //since we are using object id convert to string
        // check if the id in decoded refresh token is same as the id of the user 
        if(user._id.toString() !== decoded.id) return res.status(403).json({ success: false, message: 'Forbidden: No refresh token provided'});

        const accessToken = create_jw_access_token(user._id, "30s");
        
        return res
        .status(200)
        .json({ message: "accesstoken sent by refresh token", success: true, accessToken });
        
    } catch (error) {
        user.refreshToken = null;
        await user.save();
        return res.status(401).json({ success: false, message: 'Invalid token or token expired' });
    }
}

export default handleRefreshToken;  