import { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { StreamChat } from "stream-chat";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";
import { Navigate } from "react-router-dom";
const ChatPage = () => {
    const { id: targetUserId } = useParams();
    const [chatClient, setchatClient] = useState(null)
    const [channel, setChannel] = useState(null)
    const [loading, setLoading] = useState(true)
    const { authUser } = useAuthUser()
    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser //Only runs wehen Auth user is available
    })
    const navigate = useNavigate()
    useEffect(() => {
        const initChat = async () => {
            if (!tokenData?.token || !authUser) return;

            try {
                const client = StreamChat.getInstance(STREAM_API_KEY)
                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }, tokenData.token)
                const channelId = [authUser._id, targetUserId].sort().join("-");
                const currChannel = client.channel("messaging", channelId, {
                    members: [authUser._id, targetUserId],
                })
                await currChannel.watch();
                setchatClient(client);
                setChannel(currChannel)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        initChat()
    }, [tokenData, authUser, targetUserId]);
    const handleVideoCall = () => {
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            channel.sendMessage({
                text: `I have started a video call. Join me here ${callUrl}`
            })
            navigate(`/call/${channel.id}`)
        }

    }
    if (loading || !chatClient || !channel) return <ChatLoader />
    return (
        <div className="h-[92vh]">
            <Chat client={chatClient}>
                <Channel channel={channel}>
                    <div className="w-full relative">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader />
                            <MessageList />
                            <MessageInput focus />
                        </Window>
                    </div>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    )
}
export default ChatPage