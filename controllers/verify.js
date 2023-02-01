import { User } from "../modals/user.js";
import jwt from "jsonwebtoken"
import { config } from "dotenv";
import { hash } from "bcrypt";

config();

async function verify(req, res) {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ err: "Please provide new password" });
        }

        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(200).json({ err: "Invalid token" });
        }

        try {
            const NEW_SECRET = process.env.SECRET + user.password
            const userData = jwt.verify(token, NEW_SECRET);

            if (userData.username != user.username) {
                throw new Error("Invalid token");
            }
            const hashedPw = await hash(password, 10);
            await User.findOneAndUpdate({ _id: id }, { password: hashedPw });

            return res.status(200).json({ msg: "Password reset successful" });
        } catch (e) {
            return res.status(200).json({ err: e.message });
        }
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({ err: "Unknown error occured" });
    }
}

export default verify;