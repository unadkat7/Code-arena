import express from "express";
import { ENV } from "./lib/env.js";
const app = express();



app.get("/",(req,res)=>{
    res.status(200).json({msg:"success from backend123"})
})


app.listen(ENV.PORT,()=> console.log("Server started on port ",ENV.PORT ));