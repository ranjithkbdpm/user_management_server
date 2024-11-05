import { verify_jwt_accesstoken, verify_jwt_refreshtoken } from "../utilities/jwt.js";


export const verifyJWTAccess = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];// "Bearer <token>" format
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = verify_jwt_accesstoken(token) // Verifies token using your secret key
        req.userId = decoded.id; // Adds the decoded token's payload to `req.userId`. 
        //now usedId can be accessed by subsequent route handlers
        next(); //  Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

}   

export const verifyJWTRefresh = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }
    console.log(authHeader);
    const token = authHeader.split(' ')[1];// "Bearer <token>" format
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = verify_jwt_refreshtoken(token) // Verifies token using your secret key
        req.userId = decoded.id; // Adds the decoded token's payload to `req.userId`. 
        //now usedId can be accessed by subsequent route handlers
        next(); //  Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }

}