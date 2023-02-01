import express from 'express';
import { config } from 'dotenv';
import login from './controllers/login.js';
import register from './controllers/register.js';
import db from "./db.js";
import path from "path";
import reset from './controllers/reset.js';
import verify from './controllers/verify.js';

config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/login", (req, res) => {
    res.sendFile(path.resolve("views/login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.resolve("views/register.html"));
})

app.get("/reset-password", (req, res) => {
    res.sendFile(path.resolve("views/reset.html"));
});

app.get("/:id/:token", (req, res) => {
    res.sendFile(path.resolve("views/new-password.html"));
})

app.post("/login", login);
app.post("/register", register);
app.post("/reset-password", reset);
app.post("/:id/:token", verify);

db()
    .then(() => console.log("Connected to db"))
    .then(() => {
        app.listen(5000, () => {
            console.log(`Server up and running at: http://localhost:5000`);
        })
    })
    .catch((e) => {
        console.log(e.message);
    })
