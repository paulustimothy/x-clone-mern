import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const SignUpPage = () => {	

    // formData is the state that holds the form data, setFormData is the function that updates the form data
    // useState is used to create a state variable and a function to update it
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullname: "",
		password: "",
	});

	// useMutation is used to handle the mutation of the form data
	// isError is used to handle the error of the form data returns boolean
	// isPending is used to handle the pending state of the form data 
	// error is used to handle the error of the form data returns object
	// mutationFn is used to handle the mutation of the form data
	const {mutate:signupMutation, isError, isPending, error} = useMutation({
		mutationFn: async (formData) => {
			try {
				// /api prefix is already added in the vite.config.js file
				// headers is used to send the data to the server that is in json format
				// body it to  convert the form data to json format
				const res = await fetch("/api/auth/register",{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				});

				const data = await res.json();
				// if the response is not ok then throw an error
				if(!res.ok) throw new Error(data.error || "Something went wrong");

			} catch (error) {
				console.log(error);
				// throw error is used to throw the error to the mutationFn and update isError state
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Sign up successful");
		},
	});

	const handleSubmit = (e) => {
        // preventDefault is used to prevent the default behavior of the form which is to refresh the page when the form is submitted
		e.preventDefault();
		// formData is passed to mutate
		signupMutation(formData);
	};

	const handleInputChange = (e) => {
        // setFormData is used to update the form data when the input field is changed
        // ...formData is used to spread the form data
        // e is the event object
        // target is the element that triggered the event
        // name is the name of the input field
        // value is the value of the input field
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
        // TODO learn all the classes
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-2 w-full'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullname'
								onChange={handleInputChange}
								value={formData.fullname}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2 w-full'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Signing up..." : "Sign up"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;