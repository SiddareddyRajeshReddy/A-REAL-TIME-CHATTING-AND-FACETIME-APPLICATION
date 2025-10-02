import { useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js"
import {Citrus, BellRingIcon, LucideLogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeSelector } from "./ThemeSelector.jsx";
import useLogout from "../hooks/useLogout.js";
import { PageLoader } from "./PageLoader.jsx";

export const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat")

    const { logoutMutation, isPending } = useLogout();
    if (isPending) {
        return (<PageLoader />)
    }
    return (<>
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 flex items-center py-2">
            <div className="container mx-auto">
                <div className="flex items-center justify-end w-full gap-1.5 ">
                    {/*Only if chat Page */}
                    {
                        isChatPage && (
                            <div className="p-l-5">
                                <Link to='/' className="flex items-center gap-2.5">
                                    <Citrus className="size-8 text-primary" />
                                    <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                        Chit-Chat
                                    </span>
                                </Link>
                            </div>
                        )
                    }
                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to={"/notifications"}>
                            <button className="btn btn-ghost btn-circle">
                                <BellRingIcon className="h-6 w-6 text-base-content  hover:size-7 opacity-70 hover:opacity-100" />
                            </button>
                        </Link>
                    </div>

                    <ThemeSelector />

                    <div className="avatar">
                        <Link to={"/"}>
                        <div className="w-9 rounded-full hover:scale-110">
                            <img src={authUser?.profilePic} alt="" rel="noreferrer" />
                        </div>
                        </Link>
                    </div>

                    <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                        <LucideLogOut className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                </div>
            </div>

        </nav>
    </>)
}