import express from "express"
import { createUserValidator, loginValidator } from "../Validators/auth.js";
import { createUser, loginUser } from "../Controllers/auth.js";


const router = express.Router()

try {
    router.post("/createuser", createUserValidator ,createUser)
    router.post("/loginuser", loginValidator ,loginUser)
} catch (error) {
    console.log("Intrenal server error at auth route 🔴 ", error);
}


export default router;