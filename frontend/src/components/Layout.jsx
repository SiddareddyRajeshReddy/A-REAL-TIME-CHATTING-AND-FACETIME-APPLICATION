import { Children } from "react"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Siderbar"

export const Layout = ({children,showSidebar=false})=>{
    return (<>
        <div className="min-h-screen">
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