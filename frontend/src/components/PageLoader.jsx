import { LoaderPinwheelIcon } from "lucide-react"

export const PageLoader = ()=>{
    return (
        <>
            <div data-theme='nord' className="min-h-screen flex items-center justify-center">
                <LoaderPinwheelIcon className="animate-spin  size-10"/>
            </div>
        </>
    )
}