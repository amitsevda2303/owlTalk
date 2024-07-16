import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Schema/User.js";

dotenv.config();

const router = express.Router();

router.post("/avatar", async (req, res) => {
    try {
        const { token , avatar} = req.body;

        if (!token) {
            return res.status(400).json({ error: "JWT token must be provided" });
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWTSECERET);
            let id = decodedToken._id;
            console.log("User ID:", id);
            const updateAvatar = await User.findByIdAndUpdate(id,{avatar})
            if (updateAvatar) {
                console.log("Avatar updated successfully");
            }
            res.status(200).json({avatar: updateAvatar.avatar , message: "Avatar updated successfully" ,success: true});
        } catch (error) {
            return res.status(400).json({ error: "Invalid token" ,success: false});
        }

    } catch (error) {
        console.log("Internal server error at avatar route 🔴 ", error);
        res.status(500).json({ error: "Internal server error" ,success: false});
    }
});

router.get("/selfavatar" , async(req,res)=>{
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(400).json({ error: "JWT token must be provided" });
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWTSECERET);
            const id = decodedToken._id;
            const user = await User.findById(id)
            res.status(200).json({avatar: user.avatar,name: user.name,id: user._id,success:true})
        } catch (error) {
            return res.status(400).json({ error: "Invalid token" });
        }
        
    } catch (error) {
        console.log("Internal server error at avatar route 🔴 ", error);
        res.status(500).json({ error: "Internal server error" ,success: false});
    }
})

export default router;
