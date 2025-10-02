import { generateStreamToken } from "../lib/stream.js";
export async function getStreamToken(req, res) {
    try {
        const token = generateStreamToken(req.user._id);
        return res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error generating stream token:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}