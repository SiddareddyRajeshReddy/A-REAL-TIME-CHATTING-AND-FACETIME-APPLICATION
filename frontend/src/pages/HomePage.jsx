import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getRecommendedUsers, getUserFriends, getOutgoingRequests, sendFriendRequest } from "../lib/api.js"
import { CheckCircleIcon, LoaderPinwheel, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react"
import FriendCard from "../components/FriendCard.jsx"
import { LANGUAGE_TO_FLAG } from "../constants/index.js"
import { Link } from "react-router-dom"
const HomePage = () => {
    const queryClient = useQueryClient()
    const [outgoingRequestsIds, setOutgoingRequestIds] = useState(new Set())
    const { data: friends = [], isLoading: loadingFriends } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
        retry: false
    })
    const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: getRecommendedUsers,
        retry: false
    })
    const { data: outgoingRequests, isLoading: loadingOutgoingRequests } = useQuery({
        queryKey: ["outgoingRequests"],
        queryFn: getOutgoingRequests,
        retry: false
    })
    const { mutate: sendRequestMutation, isPending } = useMutation({
        mutationFn: sendFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outgoingRequests"] })
        }

    })
    useEffect(() => {
        const outgoingIds = new Set()
        if (outgoingRequests && outgoingRequests.length > 0) {
            outgoingRequests.forEach(element => {
                outgoingIds.add(element.recipient._id)
            });
            setOutgoingRequestIds(outgoingIds)
        }
    }, [outgoingRequests])
    const getLanguageFlag = (language) => {
        if (!language) return null
        const lanLower = language.toLowerCase();
        const countryCode = LANGUAGE_TO_FLAG[lanLower]

        if (countryCode) {
            return (
                <img src={`https://flagcdn.com/24x18/${countryCode}.png`} className="b-3 mr-3 inline-block" alt={countryCode} />
            )
        }
    }
    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="container mx-auto space-y-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Your Friends
                        </h2>
                        <Link to='/notifications' className="btn btn-outline btn-sm">
                            <UsersIcon className="mr-2 size-4" />
                            Friend Requests
                        </Link>
                    </div>
                    {
                        loadingFriends ? (
                            <div className="flex justify-center py-12">
                                <LoaderPinwheel className="animate-spin  size-10" />
                            </div>
                        ) : friends.length === 0 ? (
                            <div className="card bg-base-200 p-6 text-center">
                                <h3 className="font-semibold text-lg mn-2"> No friends yet</h3>
                                <p className="text-base-content opacity-70">
                                    Connect with the language Partners below to start practicing together
                                </p>

                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {
                                    friends.map((friend) => {
                                       return( <FriendCard key={friend._id} friend={friend} />)
                                    })
                                }
                            </div>
                        )
                    }
                    <section className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                                    Meet New Learner
                                </h2>
                                <p className="opacity-70">
                                    Discover perfect language exchange partners based on your profile
                                </p>
                            </div>
                        </div>
                        {
                            loadingUsers ? (<div className="flex justify-center py-12">
                                <LoaderPinwheel className="animate-spin  size-10" />
                            </div>) : (recommendedUsers.length === 0 ?
                                (<div className="card bg-base-200 p-6 text-center">
                                    <h3 className="font-semibold text-lg mn-2"> No Recommended Users yet</h3>
                                    <p className="text-base-content opacity-70">
                                        Refer Your friends and make
                                    </p>

                                </div>) :
                                (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {
                                        recommendedUsers.map((user) => {
                                            const hasRequestBeenSent = outgoingRequestsIds.has(user._id)
        
                                            return (
                                                <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
                                                    <div className="card-body p-5 space-y-4">
                                                        <div className="flex flex-col items-center lg:items-start gap-3">
                                                            <div className="avatar size-16 rounded-full">
                                                                <img src={user.profilePic} alt={user.fullName} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-semibold text-lg">
                                                                    {user.fullName}
                                                                </h3>
                                                                {
                                                                    user.location && (
                                                                        <div className="flex items-center text-xs opacity-70 mt-1">
                                                                            <MapPinIcon className="size-3 mr-1" />
                                                                            {user.location}
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className='flex flex-wrap gap-1.5 mb-3'>
                                                                <span className='badge badge-secondary text-xs font-semibold'>
                                                                    {getLanguageFlag(user.nativeLang)}
                                                                    Native: {user.nativeLang}
                                                                </span>
                                                                <span className='badge badge-secondary text-xs font-semibold'>
                                                                    {getLanguageFlag(user.LearningLang)}
                                                                    Native: {user.learningLang}
                                                                </span>
                                                            </div>

                                                            {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}


                                                            <button className={`btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`} onClick={() => sendRequestMutation(user._id)} disabled={isPending || hasRequestBeenSent}>
                                                                {
                                                                    hasRequestBeenSent ? (<>
                                                                        <CheckCircleIcon className="size-4 mr-2" />
                                                                        Request Sent
                                                                    </>) : (
                                                                        <>
                                                                            <UserPlusIcon className="size-4 mr-2" />
                                                                            Send Friend Request</>
                                                                    )
                                                                }

                                                            </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            )
                                        })
                                    }
                                </div>)
                            )
                        }
                    </section>
                </div>
            </div>

        </>
    )
}
export default HomePage