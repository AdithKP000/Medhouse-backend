import express from "express";
import { isAdmin, requireSignIn } from './../middlewares/authMiddlewares.js';
import { 
    UpdateCategoryController,
     categoryController, 
     createCategoryController, 
     deleteCategoryControlelr, 
     singleCategoryController
} from "../controllers/categoryController.js";


const router= express.Router()

// router || post
// create
router.post("/create-category",requireSignIn,isAdmin,createCategoryController)

//update
router.put("/update-category/:id" ,requireSignIn,isAdmin,UpdateCategoryController)

//get all category
router.get("/get-category",categoryController)

//single category
router.get('/single-category/:slug',singleCategoryController)

//delete Category 
router.delete ('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryControlelr)

//sea
export  default router