import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";

export const createCategoryController =async(req,res)=>{
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({
                message:"name is Required",
            })
        }
        const existingCategory= await CategoryModel.findOne({name})
        if ( existingCategory){
            return res.status(200).send({
                success:true,
                message:"Category already exists "
            })
        }
        const category = await new CategoryModel({
            name,
            slug:slugify(name)
        }).save()
        res.status(201).send({
            success:true,
            message:"New Category creeated",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Category",
            error,
        })
    }
}




//update Category controller

export const UpdateCategoryController=async(req,res)=>{
    try {
        const {name}=req.body;
        const {id}=req.params
       const category= await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true}) 
       res.status(200).send({
        success:true,
        message:"Ctegory updated Succesfully",
        category,
       })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"Error while updating category",
            error,
        })
    }
}


//get all cateegory controller

export const categoryController=async(req,res)=>{
    try {
        const category= await CategoryModel.find({})
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category,
        })
    } catch (error) {
        console.log(error),
        res.status(400).send({
            success:false,
            message:"unable to get all categories",
            error,
        })
    }
}



// sing;e category controller

export const singleCategoryController=async (req,res)=>{
    try {
        const singleCategory=await CategoryModel.findOne({slug:slugify(req.params.slug)})
        res.status(200).send({
            success:true,
            message:"User Found Succesfully",
            singleCategory,
        })
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            message:"Error in finding required user",
            error,
        })
    }
}


//delete Category 
export const deleteCategoryControlelr=async (req,res)=>{
    try {
        const {id}=req.params
        const category=await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:"Succesfully deleted the Category",
            category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Unable to Delet the user",
            error,
        })
    }
}