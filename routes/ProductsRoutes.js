import express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
import { 
    createProductController,
     deleteProductController,
     getPhotoController,
     getProductController, 
    getSingleProductController,
    productCategoryController,
    productFiltersController,
    searchProductController,
    similarProductController,
    updateProductController
 }
  from "../controllers/productController.js";
import formidable from "express-formidable";

const router= express.Router();

//Routes
router.post("/create-product",requireSignIn,isAdmin,formidable(),createProductController)

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get('/get-product',getProductController)

//single product
router.get("/get-product/:slug", getSingleProductController);


// get photo
router.get('/product-photo/:pid',getPhotoController)

//delete rproduct 
router.delete('/delete-product/:pid',deleteProductController)

// Filter Product
router.post('/product-filters', productFiltersController)

//Search ROute
router.get('/search/:keyword', searchProductController)

//similar producrts
router.get('/similar-product/:pid/:cid',similarProductController)

//category vise product route
router.get('/product-category/:slug',productCategoryController)
export default router;