import Role from './RoleModel.js';


export const createRole = async (req, res, next) => {
    try {
        const {role, status, permissions} = req.body;
        const existingRole = await Role.findOne({role});
        if(existingRole) {
            return res.status(409).json({success: false, message: "Role already exist"})
        } else {            
            const newRole = await Role.create({role, status, permission});
            res.status(201).json({success: true, message: "Role created successfully", newRole})
        }
    } catch(err) {
        console.log('createRole controller error:',err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getRoles = async (req, res, next) => {
    try {
        const roles = await Role.findMany();
        if(roles) {
            return res.status(200).json({success: true, message: "Roles fetched successfully"})
        } 
    } catch(err) {
        console.log('getRoles controller error:',err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
