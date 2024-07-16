import mongoose from "mongoose";
import { Schema } from "mongoose";


const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    password: {
        type:String,
        required:true
    },
    avatar:{
        type : String,
        default:"https://api.multiavatar.com/hadfgtasdftu.png",
        required: true
    }
})
const User = mongoose.model("User",UserSchema)
export default User;