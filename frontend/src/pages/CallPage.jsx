import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { StreamCall, StreamVideo, StreamVideoClient, CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks } from '@stream-io/video-react-sdk';
import { LoaderIcon } from "lucide-react";
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CallPage = () => {
    const { id: callId } = useParams()
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true)
    const { authUser } = useAuthUser()
    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY
    const { data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser //Only runs wehen Auth user is available
    })
    useEffect(() => {
        const initCall = async () => {
            if (!tokenData?.token || !authUser || !callId) return;
            try {
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }
                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token
                })

                const callInstance = videoClient.call("default", callId)
                await callInstance.join({ create: true })
                setClient(videoClient)
                setCall(callInstance)
            } catch (error) {
                console.log(error)
                toast.error("could Not join the call")
            } finally {
                setIsConnecting(false)
            }
        }
        initCall()
    }, [tokenData, authUser, callId])
    if(isConnecting)return( <div className='h-screen flex flex-col items-center justify-center p-4'>
      <LoaderIcon className='animate-spin size-10 text-primary'/>
      <p className='mt-4 text-center text-lg font-mono'>Connecting to call...</p>
    </div>)
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {
                    client && call ? (<StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>) : (<div className="flex items-center justify-center h-full">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>)
                }
            </div>
        </div>
    )


}
const CallContent = () => {
    const navigate = useNavigate()
    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState()
    if (callingState === CallingState.LEFT) return navigate("/")
    return (
        <StreamTheme>
            <SpeakerLayout />
            <CallControls />
        </StreamTheme>
    )
}

export default CallPage