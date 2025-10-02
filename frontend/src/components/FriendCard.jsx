import React from 'react'
import { Link } from 'react-router-dom'
import { LANGUAGE_TO_FLAG } from '../constants/index.js'
const FriendCard = ({ friend }) => {
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
        <div className='card bg-base-200 hover:shadow-md transition-shadow'>
            <div className=' card-body p-4'>
                <div className='flex items-center gap-3 mb-3'>
                    <div className='avatar size-12'>
                        <img src={friend.profilePic} alt={friend.fullName} />
                    </div>
                    <h3 className='font-semibold truncate'>{friend.fullName}</h3>
                </div>

                <div className='flex flex-wrap gap-3'> <span className='badge badge-secondary text-xs'>
                    {getLanguageFlag(friend.nativeLang)}
                    Native: {friend.nativeLang}
                </span>
                    <span className='badge badge-secondary text-xs'>
                        {getLanguageFlag(friend.learningLang)}
                        Learning: {friend.learningLang}
                    </span>
                </div>


                <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full mt-1'>
                    Message
                </Link>
            </div>
        </div>
    )
}

export default FriendCard
