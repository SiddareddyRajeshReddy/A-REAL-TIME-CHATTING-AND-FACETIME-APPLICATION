import './App.css'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import OnBoardingPage from './pages/OnBoardingPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import { Navigate } from 'react-router';
import { PageLoader } from './components/PageLoader.jsx';
import useAuthUser from './hooks/useAuthUser.js';
function App() {
  const {isLoading, authUser} = useAuthUser()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded
  if(isLoading) return <PageLoader/>
  return (
    <>
      <div className='h-screen' data-theme='nord'>
          <Routes>
              <Route path="/" element={isAuthenticated && isOnboarded? (<HomePage />):<Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
              <Route path="/signup" element={!isAuthenticated? <SignUpPage />:<Navigate to="/" />} />
              <Route path="/login" element={!isAuthenticated? <LoginPage />:<Navigate to="/" />} />
              <Route path="/notifications" element={isAuthenticated? <NotificationsPage />:<Navigate to="/login" />} />
              <Route path="/call" element={isAuthenticated? <CallPage />:<Navigate to="/login" />} />
              <Route path="/chat" element={isAuthenticated? <ChatPage />:<Navigate to="/login" />} />
              <Route path="/onboarding" element={isAuthenticated?(!isOnboarded? <OnBoardingPage />:<Navigate to='/'/>):<Navigate to="/login" />} />
          </Routes>
      </div>
    </>
  )
}

export default App
