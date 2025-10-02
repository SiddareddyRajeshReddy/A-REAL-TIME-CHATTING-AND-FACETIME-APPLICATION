import { create } from 'zustand'

const useTheme = create((set) => ({
  theme: localStorage.getItem("chitTheme") || "nord",
  setTheme: (theme) =>{
    localStorage.setItem("chitTheme", theme)
    set({theme})
  } 
}))

export default useTheme