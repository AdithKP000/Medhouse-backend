import { mongoose } from "mongoose";
import validator from "validator";



const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{ 
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('The provided email is invalid')
            }
        }
    },
    password:{
        required:true,
        type:String,
        unique:true,
        minLength:7,
        trim:true,
      
        validate(value){
            if((value.toLowerCase().includes('password'))){
                throw new Error('your password can not be password')
            }
            
        }
    },
    phone:{
        type:String,
        require:true
    },
    adress:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true,

    },
    role:{
        type:Number,
        default:0,
    }

},{timestamps:true})

const userModel= new mongoose.model("users",userSchema)

export default userModel;