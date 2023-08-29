import express from "express";
import * as dotenv from "dotenv"
import connect from "./config/db.config.js";
import userRouter from "./routes/user.routes.js";
import cors from "cors"

const app = express()

app.use(express.json())
app.use(cors())
dotenv.config()

connect()

app.use("/user", userRouter)

app.listen(8080, () => {
    console.log(`Server up and running on port: ${process.env.PORT}`)
})