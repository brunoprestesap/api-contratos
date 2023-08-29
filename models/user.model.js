import { Schema, model } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        lowercase: true
    },
    department: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    passwordHash: {
        type: String, 
        required: true 
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const UserModel = model("User", userSchema)

export default UserModel