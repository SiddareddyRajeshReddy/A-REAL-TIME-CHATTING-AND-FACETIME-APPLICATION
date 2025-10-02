import { PaintBucket, SignalZero } from "lucide-react"
import useTheme from "../store/useTheme"
import { THEMES } from "../constants/index.js"

export const ThemeSelector = () => {
    const { theme, setTheme } = useTheme()
    return (
        <>
            <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-circle">
                    <PaintBucket className="size-6 transition-all duration-300 hover:size-7 opacity-70 hover:opacity-100" />
                </button>

                <div tabIndex={0} className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10 max-h-80 overflow-y-auto">
                    <div className="space-y-1">
                        {THEMES.map((themeOption) => {
                            return(
                            <button key={themeOption.name}
                                className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${theme === themeOption.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}`}
                                onClick={() => setTheme(themeOption.name)} disabled={themeOption.name === theme}  >
                                <PaintBucket className="size-7" />
                                <span className="text-sm font-medium">{themeOption.label}</span>

                                <div className="ml-auto flex gap-1">
                                    {
                                        themeOption.colors.map((color, i)=>{
                                            return (<span
                                            key={i}
                                            className="size-2 rounded-full"
                                            style={{backgroundColor: color}}>

                                            </span>)
                                        })
                                    }
                                </div>
                            </button>)
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}