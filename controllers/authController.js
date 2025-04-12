import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";


import  JWT  from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
      const { name, email, password, phone, adress, answer } = req.body;
      //validations
      if (!name) {
        return res.send({ message: "Name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!password) {
        return res.send({ message: "Password is Required" });
      }
      if (!phone) { 
        return res.send({ message: "Phone no is Required" });
      }
      if (!adress) {
        return res.send({ message: "Adress is Required" });
      }
      if(!answer){
        return res.send({message:" An answer is Required for this question"})
      }
      
      //check user
      const exisitingUser = await userModel.findOne({ email });
      //exisiting user
      if (exisitingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Registered please login",
        });
      }
      //register user
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        adress,
        password: hashedPassword,
        answer,
      }).save();
  
      res.status(201).send({
        success: true,
        message:"User Register Successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in Registeration",
        error,
      });
    }
  };


  //POST LOGIN


  export const loginController= async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404),send({
                success:false,
                message:`Invalid Emil or Password`
            });
        }

        // Check user 
        const user=await userModel.findOne({email})
        if (!user){
            return res.status(404).send({
                success:false,
                message:"Invalid User",

            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(300).send({
                success:false,
                message:`Unable to find a match please try to register`,
            })
        }
        //token

         //token
         
    const token = await JWT.sign({ _id: user._id },process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

          res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              adress: user.adress,
              role: user.role,
            },
            token,
          });
        } catch (error) {
          console.log(error);
          res.status(500).send({
            success: false,
            message: "Error in login",
            error,
          });
        }
  }; 


// Forgort password
export const frogortPasswordController=async (req,res)=>{
  try {
    const {email,answer,newPassword} =req.body
    if(!email){
      res.status(400).send({message:"Email is required"})
    }
    if(!answer){
      res.status(400).send({message:"answer is required"})
    }
    if(!newPassword){
      res.status(400).send({message:"new  password is required"})
    }
    //check emil answer
    const user=await userModel.findOne({email,answer})
    //validation
    if(!user){
      res.status(500).send({
        success:false,
        message:" wrong  Email or Answer"
      })
    }const hashed =await hashPassword(newPassword) 
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
res.status(200).send({
  success:true,
  message:"password reset succesfully",
})


  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Something went wrong"
    })
  }
};


//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};



//update user Controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, password, address } = req.body;
    const user = await userModel.findById(req.user._id);

    // Validate password
    if (password && password.length < 6) {
      return res.json({ error: 'Password is required and should be greater than 6 characters' });
    }

    // Hash password if provided
    const newHashedPassword = password ? await hashPassword(password) : undefined;

    // Update user information
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: newHashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};



export const getAllUsersController = async (req, res) => {
  try {
    console.log("Fetching all users...");
 
    const allusers = await userModel.find();
    if(!allusers)
    {
      console.log("Cannot get all users");
    
    }

    res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      allusers,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message || error);
    res.status(500).send({
      success: false,
      message: "Unable to retrieve all users",
      error: error.message || error,
    });
  }
};

