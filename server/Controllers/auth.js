import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../Schema/User.js"
import { validationResult } from "express-validator"
import Chat from "../Schema/Chat.js"
import dotenv from "dotenv"

dotenv.config();

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const isValidEmail = (email) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        };
        if (!isValidEmail(email)) {
            return res
                .status(400)
                .json({ error: "Email is required" });
        }

        const data1 = await User.findOne({ email: email });
        const data2 = await User.findOne({ name: name });
        if (data1 || data2) {
            return res.status(409).json({ success: false, error: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const newUser = await User({
            name: name,
            email: email,
            password: hashedPass
        });
        await newUser.save();
        const chat = await Chat({
            userId: newUser._id
        })
        await chat.save()

        const payload = {
            _id : newUser._id
        }
        const authToken = jwt.sign(payload , process.env.JWTSECERET);
        return res.send({authToken,_id: newUser._id, res: "User created successfully",success: true})
    } catch (error) {
        console.log("Intrenal server error at auth controller🔴 ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const loginUser = async(req,res) =>{
    try {
        const {email, password } = req.body;
        const isValidEmail = (email) => {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        };
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: "Email is required" });
        }
        let user;
        if (isValidEmail) {
            user = await User.findOne({ email: email });
        }
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password", success: false });            
        }

        const payload = {
            _id : user._id
        }
        const authToken = jwt.sign(payload , process.env.JWTSECERET);
        return res.json({ authToken,_id: user._id, res: "Login successful", success: true });
        
    } catch (error) {
        console.log("Intrenal server error at auth controller🔴 ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}