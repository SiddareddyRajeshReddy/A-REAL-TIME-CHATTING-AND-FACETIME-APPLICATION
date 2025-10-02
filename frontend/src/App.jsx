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
import { Layout } from './components/layout.jsx';
import useTheme from './store/useTheme.js';
function App() {
  const {isLoading, authUser} = useAuthUser()
  const { theme } = useTheme()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded
  if(isLoading) return <PageLoader/>
  return (
    <>
      <div className='min-h-screen' data-theme={theme}>
          <Routes>
              <Route path="/" element={isAuthenticated && isOnboarded? (<Layout showSidebar={true}><HomePage /></Layout>):<Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
              <Route path="/signup" element={!isAuthenticated? <SignUpPage />:<Navigate to="/" />} />
              <Route path="/login" element={!isAuthenticated? <LoginPage />:<Navigate to={isOnboarded? "/": "/onboarding"} />} />
              <Route path="/notifications" element={isAuthenticated && isOnboarded? (<Layout showSidebar={true}><NotificationsPage /></Layout>):<Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
              <Route path="/call/:id" element={isAuthenticated && isOnboarded? (<Layout showSidebar={false}><CallPage /></Layout>):<Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
              <Route path="/chat/:id" element={isAuthenticated && isOnboarded? (<Layout showSidebar={false}><ChatPage /></Layout>):<Navigate to={!isAuthenticated?"/login":"/onboarding"} />} />
              <Route path="/onboarding" element={isAuthenticated?(!isOnboarded? <OnBoardingPage />:<Navigate to='/'/>):<Navigate to="/login" />} />
          </Routes>
      </div>
    </>
  )
}

export default App
