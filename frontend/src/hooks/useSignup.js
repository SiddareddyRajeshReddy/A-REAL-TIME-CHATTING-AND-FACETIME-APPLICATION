import { signup } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
const useSignup = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Successfully Signed Up")
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
    });
    return { isPending, error, signupMutation: mutate}
}
export default useSignup