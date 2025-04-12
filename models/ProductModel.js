import mongoose from "mongoose";
import { buffer } from "stream/consumers";
import { types } from "util";

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    hsncode:{
        required:true,
        type:Number,
    },
    slug:{
        type:String,
        required:true,

    },
    cname:{
        type:String,
    },
    company:{
        type:String,
        required:true,
        
    },
    batch:{
        type:String,
        required:true,
    },
    
    price:{
        type:Number,
        required:true,
        
    },
    salerate:{
        type:Number,
        required:true,
    },

    category:{
       type:mongoose.ObjectId,
       ref:'Category',
       required:true
        
    },
    savings:{
        type:Number,
        required:true,
    },
    pack:{
        type:String,
        required:true,
        
        },photo:{
            data:Buffer,
            contentType:String,
            
        }
    
    
},{timestamps:true})



export default mongoose.model("Products",productSchema)
