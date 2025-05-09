 import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

                           

//protected routes  
 
//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
    try {
      const decode = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
      req.user = decode
      next();
    } catch (error) {
      console.log(error);
      res.send({
        success:false,
        message:"Invalid jsonwebtoken"
      })
    }
  };


//admion action
export const isAdmin = async(req,res,next)=>{
    try {
        const user =await userModel.findById(req.user._id);
        if(user.role!==1){
            return res.status(401).send({
                success:false,
                message:"Un Authorised Acess",
            });
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"error in admin middleware",
            error,
        });
    }
};


