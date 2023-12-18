const express = require("express");
const cors = require("cors");
const { connection } = require("./src/config/db");
require("dotenv").config();
const PORT = process.env.PORT;
const {userRouter} = require("./src/Routes/user.routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);

app.get("/", async(req, res) =>{
    try {
        res.setHeader("Content-type", "text/html");
        res.status(200).send("<h1>Welcome to the Scloer Pay Server ☺️</h1>")
    } catch (error) {
        res.send(400).send(error);
    }
})

app.listen(PORT, async() =>{{
    try {
        await connection;
        console.log("Conneted to the DataBase");
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
}})