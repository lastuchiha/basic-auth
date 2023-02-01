import { User } from "../modals/user.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import sendEmail from "../helpers/sendMail.js";

config();

async function reset(req, res) {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ err: "Account with email not found" });
        }

        const NEW_SECRET = process.env.SECRET + user.password;
        const token = jwt.sign({ username: user.username }, NEW_SECRET, { expiresIn: "5m" });
        const RESET_LINK = `${process.env.HOST_URL}/${user._id}/${token}`;
        sendEmail(RESET_LINK, email)
            .then(() => console.log("SENT EMAIL"))
            .then(() => res.status(200).json({ msg: "Email sent" }))
            .catch(() => res.status(400).json({ err: "Something went wrong! Please try again later" }));

    } catch (e) {
        console.log(e.message);
        res.status(400).json({ err: "Unknown error occured" });
    }
}

export default reset;