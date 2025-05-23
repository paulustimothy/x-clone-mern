import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export const useFollow = () => {
    const queryClient = useQueryClient();

    const {mutate: followUnfollow, isPending} = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST",
                });

                const data = await res.json();

                if(!res.ok) throw new Error(data.error || "Failed to follow/unfollow user");
                
                return data;
                
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            // invalidate queries to refetch data
            Promise.all([
                queryClient.invalidateQueries({queryKey: ["suggestedUsers"]}),
                queryClient.invalidateQueries({queryKey: ["authUser"]}),
            ])
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return {followUnfollow, isPending};
}
