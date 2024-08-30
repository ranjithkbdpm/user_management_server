import User from './UserModel.js';
import Role from '../role/RoleModel.js';
import create_jw_token from '../../utilities/create_jw_token.js';


export const signUp = async (req, res, next) => {
    try {
        const {firstname, lastname, username, email, phonenumber, password, createdAt, role  } = req.body;
        let userRole = role;
        if(!userRole) {
            const defaultRole = await Role.findOne({ role: 'user' });
            if(!defaultRole){
               const createdRole = await Role.create({ role: 'user' });
               userRole = createdRole._id;
            } else {
                userRole = defaultRole._id;
            }
        } else {
            const existingRole = await Role.findOne({role: userRole});
            if(!existingRole){
               const createdRole = await Role.create({role: userRole});
               userRole = createdRole._id;
            } else {
                userRole = existingRole._id;
            }
        }

        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser) {
            return res.status(409).json({success: false, message: "User already exist"})
        } else {            
            const user = await User.create({firstname, lastname, username, email, phonenumber, password, createdAt, role:userRole});
            const userInfo = {username, email, role, name: firstname+' '+lastname, phonenumber}
            res.status(201).json({success: true, message: "User created successfully", userInfo})
        }
    } catch(err) {
        console.log('signUp controller error:',err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req, res, next) => {
    try {
        const {email, password, username} = req.body;    

        if(!email) {
            res.json({success: false, message:"Enter email address"})
        }
        if(!password) {
            res.json({success: false, message:"Enter password address"})
        }

        const user = await User.findOne({email});

        if(!user) {
            res.json({success:false, message: "Enter a valid email"})
        }

        const auth = await bcrypt.compare(password,user.password);

        if(!auth) {
            res.json({success:false, message: "Password is incorrect"})
        } else {
            const token = create_jw_token(user._id);
             res.cookie("token", token, {
             withCredentials: true,
             httpOnly: false,
           });
           res.status(201).json({ message: "login successfully", success: true });
        }
    } catch (err) {
        console.log('login controller error', err);
    }
}