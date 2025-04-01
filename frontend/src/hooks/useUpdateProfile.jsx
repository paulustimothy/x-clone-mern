import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const useUpdateProfile = () => {
    const queryClient = useQueryClient();

	// this code is to ensure that the link is always prefixed with http://

    // mutateAsync is used to update the profile so that it return some values
	const {mutateAsync: updateProfile, isPending: isUpdatingProfile} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch(`/api/users/update/`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData)
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;

			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			Promise.all([
				queryClient.invalidateQueries({queryKey: ["authUser"]}),
				queryClient.invalidateQueries({queryKey: ["userProfile"]}),
			])
		},
		onError: (error) => {
			toast.error(error.message);
		}
	})
    return {updateProfile, isUpdatingProfile}
}

export default useUpdateProfile;
