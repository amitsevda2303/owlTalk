import express from "express"
import jwt from "jsonwebtoken"
import Chat from "../Schema/Chat.js"
import dotenv from "dotenv"
import User from "../Schema/User.js"

dotenv.config();
const router = express.Router()
router.post("/fetchchat", async (req, res) => {
    try {
        const { token, receiver } = req.body;

        // Validate token and receiver
        if (!token || !receiver) {
            return res.status(400).json({ error: "Please provide a valid token and receiver ID." });
        }

        const decodedToken = jwt.verify(token, process.env.JWTSECERET);
        const userId = decodedToken._id;

        // Check if the user is valid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "Invalid user." });
        }

        // Check if the receiver is valid
        const receiverUser = await User.findById(receiver);
        if (!receiverUser) {
            return res.status(404).json({ error: "Invalid receiver." });
        }

        // Find the chat messages where the sender and receiver match
        const chat = await Chat.find({
            $or: [
                { "members.sender": userId, "members.reciever": receiver },
                { "members.sender": receiver, "members.reciever": userId }
            ]
        })

        return res.status(200).json(chat);
    } catch (error) {
        console.error("Error finding chat:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});



router.post("/sendmessage", async(req, res)=>{
   try {
    const { token, reciever , message} = req.body;
    if (token === "" || token === null) {
        throw new Error("Please provide a authentic Error")
    }
    if (message === "" || message === null) {
        return res.status(400).json({ error: "Please send a valid message." });
    }
    const decodedToken = jwt.verify(token, process.env.JWTSECERET);
    const id = decodedToken._id;
    const verifiedUser = await User.find({_id: id})


    if (verifiedUser) {
        const newMessage = new Chat({
            members: {
                sender: id,
                reciever: reciever
            },
            chat: message
        })
        const data = await newMessage.save();   
        return res.status(200).json(data);
    }else{
        throw new Error("Some error occured while authenticating 🔴🔴🔴🔴")
    }
   } catch (error) {
    console.error("Error Sending chat:", error);
    return res.status(500).json({ error: "Internal server error." });
   }
})

export default router;