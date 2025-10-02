import { Children } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Siderbar"
import useTheme from "../store/useTheme"
export const Layout = ({children,showSidebar=false})=>{
    const {theme} = useTheme()
    return (<>
        <div className="min-h-screen" data-theme={theme}>
            <div className="flex">
                {showSidebar && <Sidebar/>}
                <div className="flex-1 flex flex-col">
                    <Navbar/>
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    </>)
}