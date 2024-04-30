import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'; // Importing jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js';
 
const requireAuth = asyncHandler(async (req, res, next) => {
    try {
        let token = req.header("Authorization").replace("Bearer ", "");
        //console.log(token);
        
        if (!token) {
            return res.status(403).json({
                success: false, 
                message: "Token missing"
            });
        }
                
        const decoded = jwt.decode(token); // No need to pass the secret key
        //console.log(decoded);
        
        const userId = decoded._id;
    
        const user = await User.findOne({ _id: userId }).select("-password");
        //console.log(user);
    
        req.User = user;
        next();
            
    } catch (error) {
        
        console.log(error)
        return res.status(403).json({
            success:false, 
            message:"auth failed"
        })
    }
    
});

export { requireAuth };
