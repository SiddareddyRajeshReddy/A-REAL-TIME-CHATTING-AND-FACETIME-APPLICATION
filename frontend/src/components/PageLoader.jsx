import { LoaderPinwheelIcon } from "lucide-react"
import useTheme from "../store/useTheme"

export const PageLoader = ()=>{
    const {theme} = useTheme()
    return (
        <>
            <div data-theme={theme} className="min-h-screen flex items-center justify-center">
                <LoaderPinwheelIcon className="animate-spin  size-10"/>
            </div>
        </>
    )
}