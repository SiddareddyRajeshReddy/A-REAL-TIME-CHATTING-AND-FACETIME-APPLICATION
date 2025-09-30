import {StreamChat} from 'stream-chat';
import dotenv from 'dotenv';
dotenv.config();
const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;

if(!api_key || !api_secret){
    console.error("Stream API key and secret are required");
}

const streamClient = StreamChat.getInstance(api_key, api_secret);

export const upsertStreamUser = async(userData)=>{
    try{
        await streamClient.upsertUser(userData);
        return userData;
    }
    catch(error){
        throw error
    }
}

export const generateStreamToken = (userId)=>{
    try {
        const userStr = userId.toString();
        return streamClient.createToken(userStr);
    } catch (error) {
        console.log(error);
        throw error;
    }
} 