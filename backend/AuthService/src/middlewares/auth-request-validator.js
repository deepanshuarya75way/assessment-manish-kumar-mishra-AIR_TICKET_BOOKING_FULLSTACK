const validateUserAuth = (req, res, next) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).json({
            success: false,
            data:{},
            message: "Email and password are required",
            err : "Email or password not found in the request body"
        });
    }
    next();
};

const validateIsAdminRequest = (req,res,next) => {
    if(!req.body.id){
        return res.status(400).json({
            success: false,
            data:{},
            message: "User ID is required",
            err : "User ID not found in the request body"
        });
    }
    next();
};

module.exports = {
    validateUserAuth,
    validateIsAdminRequest
}