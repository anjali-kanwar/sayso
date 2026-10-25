import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import debateRoutes from "./routes/debateRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import dns from "dns";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/debates", debateRoutes);
app.use("/api/comments", commentRoutes);

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(backendDirectory, "../../frontend/dist");
const frontendIndex = path.join(frontendDist, "index.html");

if (existsSync(frontendIndex)) {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        if (req.path === "/api" || req.path.startsWith("/api/")) {
            return next();
        }
        res.sendFile(frontendIndex, (err) => {
            if (err) next(err);
        });
    });
} else {
    app.get("/", (req, res) => res.send("sayso API running"));
}

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