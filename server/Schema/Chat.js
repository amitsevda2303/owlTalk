import mongoose from "mongoose"
import { Schema } from "mongoose"

const ChatSchema = new Schema({
    members: {
        sender: {
            type: String,
            required: true
        },
        reciever: {
            type: String,
            required: true
        }
    },
    chat: {
        type: String,
        required: true
    },


}, { timestamps: true })

const Chat = mongoose.model("Chat", ChatSchema)
export default Chat;