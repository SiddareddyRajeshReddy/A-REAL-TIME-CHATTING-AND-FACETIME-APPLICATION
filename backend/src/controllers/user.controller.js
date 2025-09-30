import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentuser = req.user;
        const getRecommendedUsers = await User.find({
            _id: { $ne: currentUserId, $nin: currentuser.friends },
            isOnboarded: true
        }).select("-password");

        res.status(200).json({ success: true, users: getRecommendedUsers });
    } catch (error) {
        console.log("Error in getRecommendedUsers Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLang learningLang location");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, friends: user.friends });
    }
    catch (error) {
        console.log("Error in getMyFriends Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { id: recipientid } = req.params;

        //prevent sending friend request to yourself
        if (myId === recipientid) {
            return res.status(400).json({ message: "Forbidden, You can't send your own friend requests" });
        }

        //Check if recipient user exists
        const recipient = await User.findById(recipientid);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient user not found" });
        }

        //Check if already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends" });
        }

        //Check if friend request already sent
        if (await FriendRequest.findOne({ sender: myId, recipient: recipientid })) {
            return res.status(400).json({ message: "You have already sent a friend request to this user" });
        }

        const newFriendRequest = new FriendRequest({ sender: myId, recipient: recipientid });
        await newFriendRequest.save();
        res.status(200).json({ success: true, message: "Friend request sent successfully" });
    }
    catch (error) {
        console.log("Error in sendFriendRequest Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendrequest = await FriendRequest.findById(requestId);
        if (!friendrequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        //verify that the logged in user is the recipient of the friend request
        if(friendrequest.recipient.toString() !== req.user.id){
            return res.status(403).json({ message: "Forbidden, You are not the recipient of this friend request" });
        }
        const senderId = friendrequest.sender;
        const recipientId = friendrequest.recipient;
        
        //Add each other to friends list
        await User.findByIdAndUpdate(senderId, { $push: {friends: recipientId} });
        await User.findByIdAndUpdate(recipientId, { $push: {friends: senderId}});

        res.status(200).json({success: true, message: "Friend request accepted successfully"});
    }
    catch (error) {
        console.log("Error in acceptFriendRequest Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function getFriendRequests(req, res) {
    try{
        const incomingReqs = await FriendRequest.find({recipient: req.user._id, status: "pending"}).populate("sender", "fullName profilePic nativeLang learningLang location");

        const acceptedReqs = await FriendRequest.find({recipient: req.user._id, status: "accepted"}).populate("recipient", "fullName profilePic nativeLang learningLang location");
        res.status(200).json({success: true, incomingReqs, acceptedReqs});
    }
    catch (error) {
        console.log("Error in getFriendRequests Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingReqs = await FriendRequest.find({ sender: req.user._id, status: "pending" }).populate("recipient", "fullName profilePic nativeLang learningLang location");
        res.status(200).json({ success: true, outgoingReqs });
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests Controller", error);
        return res.status(500).json({ message: "Server error" });
    }
}
