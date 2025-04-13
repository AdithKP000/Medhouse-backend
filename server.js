import express from "express";
import colors from "colors";
import dotenv  from "dotenv";
import morgan  from "morgan"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import CategoryRoutes from './routes/CategoryRoutes.js'
import ProductRoutes from './routes/ProductsRoutes.js'
import cors from 'cors'

//rest object
const app=express();

//configure env
dotenv.config()

//database config
connectDB();

//middlewares
app.use(express.json())
app.use(morgan(`dev`));


const allowedOrigins = ['http://localhost:3000', 'https://yourfrontenddomain.com'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",CategoryRoutes);
app.use("/api/v1/product",ProductRoutes);




app.get("/",(req,res)=>{
    res.send("<h1>Welcome To Ecommerce app</h1>");
})
//PORT
const PORT= process.env.PORT || 8080;
//listen
app.listen(PORT,()=>{console.log(`Server is up on  ${process.env.DEV_MODE} mode and Runnging on ${process.env.PORT}`.bgCyan.white);
})



//category route