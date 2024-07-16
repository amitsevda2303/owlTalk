import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import User from "../Schema/User.js";

dotenv.config();

const router = express.Router()

router.get("/getuser", async(req,res)=>{
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(400).json({ error: "JWT token must be provided" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWTSECERET);
        const id = decodedToken._id;
        const users = await User.find().select("-password").select("-email")
        res.send(users)
    } catch (error) {
        return res.status(400).json({ error: "Invalid token"});
    }
})

export default router;

