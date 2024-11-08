import mongoose from 'mongoose';
import Role from '../role/RoleModel.js';
import bcrypt from 'bcrypt';


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Firstname is required"],
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
        required:[true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
    },
    phonenumber: {
        type: String,
        required: [true, "Phone number is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        // default: new Date(),
        default: Date.now,
    },
    role: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role',
        // default: 'user'
     },
     refreshToken: {
        type: String, // For single refresh token per user, use String
        default: null,
    },
    // Uncomment below to allow multiple refresh tokens (e.g., for multiple devices):
    // refreshTokens: [
    //     {
    //         token: String,
    //         issuedAt: { type: Date, default: Date.now },
    //     }
    // ]
});

UserSchema.pre("save", async function () {

    // role is handled in controller function no need of it here
    // if (this.isModified('role')) {
    //     // Role provided during user creation
    //     const existingRole = await Role.findById(this.role);
    //     if (!existingRole) {
    //         // If the provided role does not exist, create it
    //         const createdRole = await Role.create({ role: this.role });
    //         this.role = createdRole._id;
    //     }
    // } else {
    //     // No role provided, set default role
    //     const defaultRole = await Role.findOne({ role: 'user' });
    //     if (!defaultRole) {
    //         const createdRole = await Role.create({ role: 'user' });
    //         this.role = createdRole._id;
    //     } else {
    //         this.role = defaultRole._id;
    //     }
    // }

    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    } 
});

// model creation and export
export default mongoose.model("User", UserSchema);

