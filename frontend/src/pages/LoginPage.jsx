import { useQueryClient } from "@tanstack/react-query"
import { useState, useEffect, useRef } from "react"
import { Citrus } from "lucide-react"
import { Link } from "react-router-dom"
import toast, {Toaster} from 'react-hot-toast'
const LoginPage = () => {
    const [fade, setFade] = useState(true);
    const ref = useRef(null)
    const queryClient = useQueryClient()
    const [loginData, setloginData] = useState({
        email: "",
        password: "",
    });
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                if (ref.current.src.includes("Chatting-bro.svg")) {
                    ref.current.src = "./Video call-bro.svg"
                }
                else {
                    ref.current.src = "./Chatting-bro.svg"
                }
                setFade(true);
            }, 2000);

        }, 4500);
        return () => clearInterval(interval);
    }, [])
    const handleLogin = ()=>{

    }
    return (
        <>
            <div className="min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8" data-theme="nord">
                <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                    {/*Image Right */}
                    <div className="lg:flex w-full bg-primary/10 items-center justify-center">
                        <div className="p-8">
                            <div className="relative aspect-square max-w-sm mx-auto">
                                <img ref={ref} src="./Chatting-bro.svg" alt="" className={`w-full h-full transition-opacity duration-[2s] ${fade ? "opacity-100" : "opacity-0"}`} />
                            </div>
                            <div className="text-center space-y-3 mt-6">
                                <h2 className="text-xl font-semibold">Connnect with language partners worldwide</h2>
                                <p className="text-sm opacity-70">
                                    Join our community of language learners and start practicing today!
                                </p>
                            </div>
                        </div>
                    </div>
                    {/*SIGN uP FORM LEFT*/}
                    <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                        {/*Logo */}
                        <div className="mb-4 flex items-center justify-start gap-2">
                            <Citrus className="size-9 text-primary" />
                            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">Chit-Chat</span>
                        </div>
                        <div className="w-full">
                            <form onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">
                                        Sign in to the Chit-Chat to learn the languages the easy Way ... connecting People
                                    </p>

                                    <div className="space-y-3">
                                        <div className="form-control w-full">
                                            <label className="label">
                                                <span className="label-text">Email</span>
                                            </label>
                                            <input type="email"
                                                placeholder="Rahul@gmail.com"
                                                className="input input-bordered w-full"
                                                value={loginData.email}
                                                onChange={(e) => setSignUpData({ ...loginData, email: e.target.value })}
                                                required
                                            />
                                            <label className="label">
                                                <span className="label-text">Password</span>
                                            </label>
                                            <input type="password"
                                                placeholder="********"
                                                className="input input-bordered w-full"
                                                value={loginData.password}
                                                onChange={(e) => setSignUpData({ ...loginData, password: e.target.value })}
                                                required
                                            />
                                            <p className="text-xs opacity-70 mt-1">
                                                Password should be at least 6 characters long
                                            </p>
                                        </div>
                                    </div>
                                    {/* <button className={`btn btn-primary w-full ${isPending ? 'animate-pulse' : ''}`} type="submit">{isPending ? (<span className='loading loading-spinner loading-xs'></span>) : ("Login")}</button> */}
                                    <p className="test-sm">
                                        Don't have an account?{" "}
                                        <Link to="/signup" className="text-primary hover:underline">Sign in</Link>
                                    </p>
                                </div>
                                <Toaster />
                            </form>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default LoginPage