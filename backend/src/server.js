import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import debateRoutes from "./routes/debateRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import dns from "dns";

dns.setServers(["1.1.1.1","8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/comments", commentRoutes);

app.get("/", (req, res) => res.send("sayso API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





// import express from "express";
// import {connectDB} from "./config/db.js";
// import dotenv from "dotenv"
// import dns from "dns";

// dns.setServers(["1.1.1.1","8.8.8.8"]);

// dotenv.config();

// const app = express();
// const PORT=process.env.PORT || 5001;

// connectDB().then(()=>{
//     app.listen(PORT, ()=>{
//     console.log("Server is started on PORT:", PORT);
// });
// });