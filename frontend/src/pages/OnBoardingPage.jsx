import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthUser from '../hooks/useAuthUser.js'
import { useState } from 'react';
import toast, {Toaster} from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { CameraIcon, MapPin, MapPinIcon, ShuffleIcon,LoaderPinwheelIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';
const OnBoardingPage = () => {
    const { isLoading, authUser } = useAuthUser();
    const queryClient = useQueryClient();
    const [formState, setFormState] = useState(
        {
            fullName: authUser?.fullName || "",
            bio: authUser?.bio || "",
            nativeLang: authUser?.nativeLang || "",
            learningLang: authUser?.learningLang || "",
            location: authUser?.location || "",
            profilePic: authUser?.profilePic || ""
        }
    )
    const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError:(error)=>{
            toast.error(error.response.data.message);
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        onboardingMutation(formState);
    }
    const handleRandomAvatar = (e) => {
        const avatar_img = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${avatar_img}`;
        setFormState({...formState, profilePic: randomAvatar})
        toast.success("Random Avatar Generated Succesfully")
    }
    return (
        <>
            <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
                <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
                    <div className='card-body p-6 sm:p-8'>
                        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6 text-primary'>Complete Your Profile</h1>
                        <form onSubmit={handleSubmit} className='space-y-2'>
                            {/*Profile Pic */}
                            <div className='flex flex-col items-center justify-center space-y-4'>
                                <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                                    {
                                        formState.profilePic ? (
                                            <img
                                                src={formState.profilePic}
                                                alt="Profile Preview"
                                                className='w-full h-full object-cover'
                                            />) : (
                                            <div className='flex items-center justify-center h-full'>
                                                <CameraIcon className='size-12 text-base-content opacity-40' />
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'>
                                        <ShuffleIcon className='size-4 mr-2' />
                                        Generate Random Avatar
                                    </button>
                                </div>
                            </div>

                            {/*Full Name */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Full Name</span>
                                </label>
                                <input type="text"
                                    name="fullName"
                                    value={formState.fullName}
                                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                    className='input input-bordered w-full '
                                    placeholder='Your Full Name'
                                />
                            </div>
                            {/*Bio */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Bio</span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formState.bio}
                                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                    className='textarea textarea-bordered w-full h-24'
                                    placeholder='Tell others about your views and your goals'
                                />
                            </div>
                            {/*Language*/}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text'>Native Language</span>
                                    </label>
                                    <select name="nativeLang"
                                        value={formState.nativeLang}
                                        onChange={(e) => setFormState({ ...formState, nativeLang: e.target.value })}
                                        className='select select-bordered w-full'
                                    >
                                        <option value="">Select your Native language</option>
                                        {
                                            LANGUAGES.map((lang) => (
                                                <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className='form-control'>
                                    <label className='label'>
                                        <span className='label-text'>Learning Language</span>
                                    </label>
                                    <select name="learningLang"
                                        value={formState.learningLangLang}
                                        onChange={(e) => setFormState({ ...formState, learningLang: e.target.value })}
                                        className='select select-bordered w-full'
                                    >
                                        <option value="">Select language you are learning</option>
                                        {
                                            LANGUAGES.map((lang) => (
                                                <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            {/*Location */}
                            <div className='form-control'>
                                <label className='label'>
                                    <span className='label-text'>Location</span>
                                </label>
                                <div className='relative'>
                                    <MapPinIcon className=' absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content z-10 opacity-70' />
                                    <input type="text"
                                        name="location"
                                        value={formState.location}
                                        onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                        className='input input-bordered w-full pl-10'
                                        placeholder='City, Country'
                                    />
                                </div>
                            </div>

                            {/*SUBMIT BUTTOn */}
                            <button onSubmit={handleSubmit} className='btn btn-primary w-full' disabled={isPending} type='submit'>
                                    {!isPending?(
                                        <>
                                        <span className='text-white'>Complete Onboarding</span>
                                            
                                        </>
                                    ):(
                                        <>
                                        <LoaderPinwheelIcon className="animate-spin size-5 text-white"/>
                                        </>
                                    )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster/>
        </>
    )
}

export default OnBoardingPage