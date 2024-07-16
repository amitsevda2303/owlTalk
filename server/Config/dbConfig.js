import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

const connectToMongo = async() => {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log('Connected Successfully with DataBase 🟢')
    } catch (error) {
        console.log('unable to connect database 🔴', error)
    }
}


export default connectToMongo;