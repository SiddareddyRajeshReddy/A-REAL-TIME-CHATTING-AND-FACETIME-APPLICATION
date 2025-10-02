import { IsRestoringProvider, useMutation, useQueryClient } from "@tanstack/react-query"
import { logout } from "../lib/api"
import toast from 'react-hot-toast'
const useLogout = () => {
    const queryClient = useQueryClient();
    const {
        mutate: logoutMutation,
        isPending
    } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success('Successfully logged out')
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        }
    })
    return {
        isPending,
        logoutMutation
    }
}

export default useLogout;