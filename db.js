import mongoose from "mongoose";
import { config } from "dotenv";

config();
mongoose.set('strictQuery', false);
export default () => {
    return new Promise((res) => {
        res(mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
        }));
    })
}