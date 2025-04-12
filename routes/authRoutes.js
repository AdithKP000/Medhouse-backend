import express from "express";
import {registerController,loginController, testController,frogortPasswordController, updateProfileController, getAllUsersController}from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
//router object 
const router = express.Router()


//routing
//Register|| POST
router.post(`/register`,registerController)


//LOGIN || POST
router.post(`/login`,loginController)

//Forgort Password || POST
router.post('/forgort-password',frogortPasswordController)

//test Routers
router.get(`/test`,requireSignIn,isAdmin,testController)

//protected user Routes auth
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})
try {
    router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
        res.status(200).send({ok:true});
        console.log
    })
} catch (error) {
    console.log(error)
}


// update profile
router.put("/profile/:id",requireSignIn,updateProfileController)


//protected admin Routes auth


//Protectes

//get all users
router.get("/getusers",getAllUsersController)


export default  router;
