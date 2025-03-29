import { Routes, Route, Navigate } from 'react-router-dom'
import SignUpPage from './pages/auth/SignUpPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'  
import ProfilePage from './pages/profile/ProfilePage.jsx'

import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'

import { Toaster } from 'react-hot-toast'	
import { useQuery } from '@tanstack/react-query'

function App() {

	const { data:authUser, isLoading} = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();

				// if there is an error, return null so that we can redirect to login page
				if(data.error) return null;

				if(!res.ok) throw new Error(data.error || "Something went wrong");

				return data;

			} catch (error) {
				console.log("error in authUser:", error);
				throw new Error(error);
			}
		},
		// we don't want to retry the query if it fails
		retry: false,	
	});

	if (isLoading){
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		)
	}

  return (
    <>
      <div className='flex max-w-6xl mx-auto'>
        {authUser && <Sidebar />} {/* common component if user is logged in show sidebar */}
		<Routes>
			{/* if user is not logged in, redirect to login page */}
			<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
			<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUpPage />} />
			<Route path='/login' element={authUser ? <Navigate to='/' /> : <LoginPage />} />
			<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
			<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
		</Routes>
      {authUser && <RightPanel />} {/* common component if user is logged in show right panel */}
	  <Toaster />
		</div>
    </>
  )
}

export default App
