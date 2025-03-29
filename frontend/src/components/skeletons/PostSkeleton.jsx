const PostSkeleton = () => {
	return (
		<div className='flex gap-2 items-start p-4 border-b border-gray-700'>
			<div className='w-8'>
				<div className='skeleton w-8 h-8 rounded-full'></div>
			</div>
			<div className='flex flex-col flex-1'>
				<div className='flex gap-2 items-center'>
					<div className='skeleton h-4 w-20'></div>
					<div className='skeleton h-3 w-32'></div>
				</div>
				<div className='flex flex-col gap-3 mt-2'>
					<div className='skeleton h-16 w-full'></div>
				</div>
				<div className='flex justify-between mt-3'>
					<div className='flex gap-4 items-center w-2/3 justify-between'>
						<div className='skeleton h-4 w-8'></div>
						<div className='skeleton h-4 w-8'></div>
						<div className='skeleton h-4 w-8'></div>
					</div>
					<div className='flex w-1/3 justify-end'>
						<div className='skeleton h-4 w-4'></div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PostSkeleton;