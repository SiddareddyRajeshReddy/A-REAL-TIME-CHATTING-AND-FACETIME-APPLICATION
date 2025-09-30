import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";
//Sign Up Controller
export async function signup(req, res) {
    const { email, password, fullName } = req.body;
    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!pattern.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const avatar_img = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${avatar_img}`;
        //create new User in MongoDB
        const newUser = await User.create({ email, password, fullName, profilePic: randomAvatar });
        //create a User in Stream as Well 
        try {
            await upsertStreamUser({ id: newUser._id, name: newUser.fullName, profilePic: newUser.profilePic || "" });
            console.log("Stream User created for", newUser.fullName);
        }
        catch (error) {
            console.log("Error in creating Stream User", error);
        }
        newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.cookie("jwt", token, {
            httpOnly: true, // prevent XSS attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",//prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })
        res.status(201).json({ success: true, user: newUser })
    }
    catch (error) {
        console.log("Error in SignUp Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Login Controller
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //Is It Valid Email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        //PASSWORD MATCH
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        res.cookie("jwt", token, {
            httpOnly: true, // prevent XSS attacks
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",//prevent CSRF attacks
            secure: process.env.NODE_ENV === "production"
        })
        res.status(201).json({ success: true, user: user })
    }
    catch (error) {
        console.log("Error in Login Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Logout Controller
export function logout(req, res) {
    if (req.cookies.jwt) {
        res.clearCookie("jwt")
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

//Onboarding Controller
export async function onboarding(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLang, learningLang, location } = req.body;
        if (!fullName || !nativeLang || !learningLang || !location || !bio) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLang && "nativeLang",
                    !learningLang && "learningLang",
                    !location && "location"
                ].filter(Boolean)
            });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, {
            fullName, bio, nativeLang, learningLang, location, isOnboarded: true
        }, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "Onboarding completed", user: updatedUser });

        //Update User in Stream as well
        try {
            await upsertStreamUser({ id: updatedUser._id, name: updatedUser.fullName, profilePic: updatedUser.profilePic || "" });
            console.log("Stream User updated for", updatedUser.fullName);
        }
        catch (streamError) {
            console.log("Error in updating Stream User", streamError);
        }
    }
    catch (error) {
        console.log("Error in Onboarding Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}