import { compare } from "bcrypt";
import { User } from "../modals/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

async function login(req, res) {
    try {
        const { emailOrUsername, password } = req.body;

        if (!emailOrUsername || !password) {
            return res.status(400).json({ err: "Required fields are missing" });
        }

        const user = await User.findOne({
            $or: [{ username: emailOrUsername }, { email: emailOrUsername }]
        });

        if (!user) {
            return res.status(400).json({ err: "Account not found" });
        }

        if (!await compare(password, user.password)) {
            return res.status(400).json({ err: "Invalid password" });
        }

        const accessToken = jwt.sign({
            username: user.username,
            email: user.email
        }, process.env.SECRET, { expiresIn: "2d" });

        const payload = {
            username: user.username,
            email: user.email,
            accessToken,
            msg: "Successfully logged in"
        }
        return res.status(400).json({ ...payload });

    } catch (e) {
        console.log(e.message)
        return res.status(400).json({ err: "Unknown error occured" });
    }
}

export default login;