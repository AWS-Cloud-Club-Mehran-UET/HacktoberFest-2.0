import bcrypt from "bcrypt";
import userModel from "../models/user.models.js";
import { signToken } from "../utils/jwt.utils.js";

export const handleUserLogin = async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({ message: "Either email or password is incorrect." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Either email or password is incorrect." });
        }

        const token = signToken({ userId: user.id }, "3d");

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...safeUser } = user.toObject();

        return res.status(200).json({
            message: "Login successful",
            user: safeUser,
            token
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};


export const handleUserRegister = async (req, res) => {
    const password = req.body.password.trim();
    const email = req.body.email.trim().toLowerCase();

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

         const newUser = await userModel.create({
            email,
            password,
        });

        return res.status(200).json({
            message: "Account created successfully. Please check your email to verify.",
            id: newUser._id,
            email
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
};
