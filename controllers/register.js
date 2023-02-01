import { hash } from "bcrypt";
import { User } from "../modals/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

async function register(req, res) {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({ err: "Required fields are missing" });
        }

        const hashedPw = await hash(password, 10);
        await new User({ username, email, password: hashedPw }).save();
        const accessToken = jwt.sign({
            username,
            email
        }, process.env.SECRET);

        return res.status(200).json({
            username,
            email,
            accessToken,
            msg: "Successfully registered"
        });
    } catch (e) {
        res.status(400).json({ err: "Unknown error occured" });
        console.log(e.message);
    }
}

export default register;