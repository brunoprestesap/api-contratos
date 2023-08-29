import express from "express";
import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../config/jwt.config.js"
import isAuth from "../middlewares/isAuth.js"
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const saltRounds = 10

const userRouter = express.Router()

//rota de signup
userRouter.post("/sign-up", async (req, res) => {
    try {
        const { password } = req.body

        if (!password || !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)) {
            return res.status(400).json({ message: "Senha não tem os requisitos necessários" })
        }

        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await UserModel.create({ ...req.body, passwordHash: hashedPassword })

        delete newUser._doc.passwordHash

        return res.status(201).json(newUser)

    } catch (error) {
        console.log(error.errors)
        return res.status(400).json({ msg: "Usuário não criado" })
    }
})

//rota de login
userRouter.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "Usuário não cadastrado" })
        }

        if (await bcrypt.compare(password, user.passwordHash)) {
            delete user._doc.passwordHash
            const token = generateToken(user)
            return res.status(200).json({ user: { ...user._doc }, token: token })
        } else {
            return res.status(401).json({ message: "Email e senha não conferem" })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

//rota profile
userRouter.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
    try {

        const loggedUser = req.currentUser

        const user = await UserModel.findById(loggedUser._id)

        delete user._doc.passwordHash
        delete user._doc.__v

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})



export default userRouter