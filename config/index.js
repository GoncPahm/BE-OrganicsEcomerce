import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Connect sucessfull");
    } catch (error) {
        console.log(error);
    }
}

export default connect;