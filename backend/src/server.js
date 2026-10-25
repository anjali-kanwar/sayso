import express from "express";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv"
import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config();

const app = express();
const PORT=process.env.PORT || 5001;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
    console.log("Server is started on PORT:", PORT);
});
});