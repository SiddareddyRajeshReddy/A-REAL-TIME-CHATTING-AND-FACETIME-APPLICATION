import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { getFriendRequests } from "../lib/api.js"
import { UserCheckIcon, LoaderPinwheel, BellIcon, ClockIcon, MessageSquareIcon } from "lucide-react"
import { acceptFriendRequest } from "../lib/api.js"
import { Link } from "react-router-dom"
const NotificationsPage = () => {
    const queryClient = useQueryClient()
    const { data: friendReqs, isLoading } = useQuery({
        queryKey: ["friendRequests"],
        queryFn: getFriendRequests,
        retry: false
    })
    const { mutate: acceptRequestMutation, isPending } = useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
            queryClient.invalidateQueries({ queryKey: ["friends"] })
        }
    })
    const incomingReqs = friendReqs?.incomingReqs || []
    const acceptedReqs = friendReqs?.acceptedReqs || []
    console.log(incomingReqs, acceptedReqs)
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>
                {
                    isLoading ? (<>
                        <div className="flex justify-center py-12">
                            <LoaderPinwheel className="animate-spin  size-10" />
                        </div>
                    </>) : (<>{
                        incomingReqs.length > 0 && (
                            <section className=" space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <UserCheckIcon className="h-5 w-5 text-primary" />
                                    Friend Requests
                                    <span className="badge badge-primary ml-2">{incomingReqs.length}</span>
                                </h2>
                                <div className="space-y-3">
                                    {incomingReqs.map((request) => {
                                        return (
                                            <div
                                                key={request._id}
                                                className="card bg-base-200 shadow-sm hover-shadow-md transistion-shadow">
                                                <div className="card-body p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="avaatar w-14 h-14 rounded-full bg-base-300">
                                                                <img src={request.sender.profilePic} alt={request.sender.fullName} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-primary">{request.sender.fullName}</h3>
                                                                <div className="flex flex-wrap gap-1.5 mt-1">

                                                                    <span className="badge badge-secondary badge-sm font-bold">
                                                                        Native: {request.sender.nativeLang}
                                                                    </span>
                                                                    <span className="badge badge-secondary badge-sm font-bold">
                                                                        Learning: {request.sender.learningLang}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="btn btn-primary" onClick={() => acceptRequestMutation(request._id)} disabled={isPending}>Accept</button>
                                                    </div>

                                                </div>
                                            </div>

                                        )
                                    })}
                                </div>
                            </section>
                        )
                    }</>)
                }
                {
                    isLoading ? (<>
                        <div className="flex justify-center py-12">
                            <LoaderPinwheel className="animate-spin  size-10" />
                        </div>
                    </>) : (<>{
                        acceptedReqs.length > 0 && (
                            <section className=" space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <BellIcon className="h-5 w-5 text-primary" />
                                    New Connections
                                </h2>
                                <div className="space-y-3">
                                    {acceptedReqs.map((notification) => {
                                        return (
                                            <div
                                                key={notification._id}
                                                className="card bg-base-200 shadow-sm hover-shadow-md transistion-shadow">
                                                <div className="card-body p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="avaatar w-14 h-14 rounded-full bg-base-300">
                                                                <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                                                            </div>
                                                            <div className="flex-1">

                                                                <h3 className="font-semibold text-primary">{notification.recipient.fullName}</h3>
                                                                <p>{notification.recipient.fullName}  accepted your Friend Request</p>
                                                                <p className="text-xs flex items-center opacity-70">
                                                                    <ClockIcon className="w-3 h-3 mr-1" />  Recently
                                                                </p>

                                                            </div>

                                                        </div>
                                                        <Link to={`/chat/${notification.recipient._id}`} className="badge badge-success">
                                                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                                                            New Friend
                                                        </Link>

                                                    </div>

                                                </div>
                                            </div>

                                        )
                                    })}
                                </div>
                            </section>
                        )
                    }</>)
                }
                {incomingReqs.length === 0 && acceptedReqs.length === 0 && (
                    <><div className="card bg-base-200 p-6 text-center">
                        <h3 className="font-semibold text-lg mn-2"> No Notifications Found</h3>
                        <p className="text-base-content opacity-70">
                            Make Friends and learn the language the easy way
                        </p>

                    </div></>
                )}
            </div>
        </div>
    )
}

export default NotificationsPage