import slugify from "slugify";
import ProductModel from "../models/ProductModel.js";
import CategoryModel from "../models/CategoryModel.js";
import fs from 'fs'


 export const createProductController=async(req,res)=>{
    try {
        const {name,hsncode,company,batch,price,salerate,category,savings,pack,}=req.fields;
        const {photo} = req.files;

//validation
switch(true){
    case !name:
            return res.status(500).send({error:"name  is Required"});
        case !hsncode:
            return res.status(500).send({error:" HSN Code  is Required"});
       
        case !company:
                return res.status(500).send({error:" Company name  is Required"});
        case !salerate:
            return res.status(500).send({error:"salerate  is Required"});
        case !price:
            return res.status(500).send({error:"Price  is Required"});
        case !category:
            return res.status(500).send({error:"Category  is Required"});
        case !batch:
            return res.status(500).send({error:"batch  is Required"});
        case !savings:
            return res.status(500).send({error:"Your Savings on this product is required Required"});
         case !pack:
            return res.status(500).send({error:"per pach details  is Required"});            
        case !photo && photo.size>1000000 :
            return res.status(500).send("photo  is Required amd should be less than 1 MB")
    
}


        const products = new  ProductModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save()
        res.status(200).send({
            success:true,
            message:"Product created Succesfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Unable to create the product",
            error,
        })
    }
 }



 export const getProductController=async(req,res)=>{
    try {
        const products=await ProductModel.find({})
        .select("-photo")
        .limit(12)
        .populate('category')
        .sort({createdAt:-1});
        res.status(200).send({
            success:true,
            message:"All Products",
            toatalCount :products.length,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"unable to get Products",
            error,
        })
    }
 }


 //get single product
 export const getSingleProductController=async(req,res)=>{
    try {
        const product=await ProductModel.findOne({slug:req.params.slug})
        
        .select("-photo")
        .populate('category')
        res.status(200).send({
            success:true,
            message:"Product recieved succesfully",
            product
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Unable to get single product",
            error
        })
    }
 }
  


export const getPhotoController=async(req,res)=>{
    try {
        const product= await ProductModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error),
        res.status(500).send({
            success:false,
            message:"Unable to get photo",
            error,
        })
    }
}


export const deleteProductController=async (req,res)=>{
    try {

        const product=await ProductModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:"Product deleted Succesfully",
            product,
        })
        res.status(200).send({
            success:false,
            message:"Succesfully deleted product",
            product, 
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Unable to delete user",
            error,
        })
    }
}


export const updateProductController=async(req,res)=>{
    try {
        const {name}=req.fields;  

        const {photo} = req.files;

//validation


const products = await ProductModel.findByIdAndUpdate(
    req.params.pid,
    { ...req.fields, slug: slugify(name) },
    { new: true }
  );
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();
  res.status(201).send({
    success: true,
    message: "Product Updated Successfully",
    products,
  });
} catch (error) {
  console.log(error);
  res.status(500).send({
    success: false,
    error,
    message: "Error in Updte product",
  });
}
};


export const productFiltersController=async(req,res)=>{
   try {
    const {checked,radio}=req.body;
    let args={}
    if(checked.length>0) args.category=checked
    if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
    const products= await ProductModel.find(args)
    res.status(200).send({
        succes:true,
        message:"Products Found under the Category",
        products,
    })
   } catch (error) {
    console.log(error);
    res.status(500).send({
        succes:'flase',
        message:'Unable to filter the message',
        error,
    })
   }
}


export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const resutls = await ProductModel
          .find({
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { cname: { $regex: keyword, $options: "i" } },
              { company: { $regex: keyword, $options: "i" } },
            ],
          })
          .select("-photo");
        res.json(resutls);
      } catch (error) {
        console.log(error);
        res.status(400).send({
          success: false,
          message: "Error In Search Product API",
          error,
        });
      }
    }; 
    
    export const similarProductController= async(req,res)=>{
        try {
            const{pid,cid}= req.params;

            const products= await ProductModel.find({
                category:cid,
                _id:{ $ne:pid }
        }).select("-photo").populate("category").limit(3)

        res.status(200).send({
            success:true,
            message:"Similar Products Found",
            products,
        })
        } catch (error) {
            console.log(error)
            res.status(404).send({
                success:false,
                message:"Unable to find similar products",
                error
            })
        }
    }

    export const productCategoryController= async(req,res)=>{
        try {
                const category=  await CategoryModel.findOne({slug:req.params.slug})
                const product = await ProductModel.find({category}).populate("category")
                res.status(200).send({
                    succes:true,
                    category,
                    product,
                    message:'Succesfully found product',
                });
            
        } catch (error) {
            console.log(error)
            res.status(404).send({
                success:false,
                message:"Unable to find products under this  category",
                error
            })
        }
    }