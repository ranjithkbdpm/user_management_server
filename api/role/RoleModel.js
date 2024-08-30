import mongoose from 'mongoose';



const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        default:'user',
        enum: ["user", "admin", "employee", "manager"], 
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "InActive"]
      },
    // permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
});


export default mongoose.model("Role", RoleSchema);