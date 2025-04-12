import  JWT  from "jsonwebtoken";
import userModel from "../models/userModel.js";


const getToken = async(req,res)=>{
    const {email,password}=req.body;



    const user=await userModel.findOne({email})
    if (!user){
        res.status(404).send({
            success:false,
            message:"Invalid User",
    
        })
    }

    const payload={
        id: user._id,
        iat:1684932952,
        exp: 1685537752,
    }
    
    const key=process.env.JWT_SECRET;
    
const  encodedJwt = JWT.sign(payload, key, {
        expiresIn: "7d",
      });
    

}

export default encodedJwt;


