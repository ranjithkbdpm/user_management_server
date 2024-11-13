const Role = require('../models/Role'); // Assuming Role model is defined with RoleSchema

const authorize = () => async (req, res, next) => {
    try {
        const userRole = req.user.role; // Ensure req.user is populated with authenticated user

        // Fetch the role from the database
        const role = await Role.findOne({ role: userRole, status: "Active" });

        if (!role) {
            return res.status(403).json({ message: "Role not found or inactive" });
        }

        // Use `req.path` to get the endpoint and `req.method` to get the HTTP method
        const endpoint = req.path;
        // const method = req.method;

        // Check if the role has access to the specified endpoint and method
        // const hasAccess = role.access.some(access => 
        //     access.endpoint === endpoint && access.methods.includes(method)
        // );
        const hasAccess = role.access.includes(endpoint);
        

        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }

        // If access is granted, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authorization error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = authorize;
