import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";

const Posts = ({feedType}) => {

	const getPostEndpoint = () => {
		switch(feedType) {
			case "following":
				return "/api/posts/following";
			case "for-you":
				return "/api/posts/all";
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostEndpoint();

	const {data:posts, isLoading, refetch, isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok) {
					throw new Error(data.error || "Failed to fetch posts");
				}

				return data;

			} catch (error) {
				throw new Error(error);
			}
		}
	});
	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	return (
    // TODO learn all the classes
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;