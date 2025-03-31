
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import FloatingShape from './components/FloatingShape'
import SignUpPage from './Pages/SignUpPage'
import LogInPage from './Pages/LogInPage'
import EmailVerificationPage from './Pages/EmailVerificationPage'
import { Toaster } from 'react-hot-toast';
import { userAuthStore } from './store/authStore'
import { useEffect } from 'react';
import Dashboard from './Pages/Dashboard'
import LoadingSpinner from './components/LoadingSpinner'
import ForgotPasswordPage from './Pages/ForgotPasswordPage'
import ResetPasswordPage from './Pages/ResetPasswordPage'

// protect route that requires authentication
const ProtectedRoute = ({children}) => {
  const { isAuthenticated , user} = userAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if ( user && !user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }
   
  return children;
}

// redirect authenticated users to home page
const RedirectAuthenticatedUser = ({children}) => {
  const { isAuthenticated , user } = userAuthStore();
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }
  console.log("RedirectAuthenticatedUser rendered",children);
  return children;

}



function App() {
  const {isCheckingAuth,checkAuth,isAuthenticated,user} = userAuthStore();

  useEffect(() => {
      checkAuth();
  }
  , [checkAuth]);

  if(isCheckingAuth) return <LoadingSpinner />; 
  
  
  console.log("App component rendered");
  console.log("isAuthenticated:",isAuthenticated);
  console.log("user:",user);
  console.log("isCheckingAuth:",isCheckingAuth);
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center
    justify-center relative overflow-hidden'>
    <FloatingShape color="bg-green-500" size='w-64 h-64' top="-5%" left="10%" delay={0} />
    <FloatingShape color="bg-emerald-500" size='w-48 h-48' top="70%" left="80%" delay={5} />
    <FloatingShape color="bg-lime-500" size='w-32 h-32' top="40%" left="-10%" delay={2} />

    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>} />

      <Route path='/signup' element={
        <RedirectAuthenticatedUser>
          <SignUpPage />
        </RedirectAuthenticatedUser>
      } />

      <Route path='/login' element={
         <RedirectAuthenticatedUser>
        <LogInPage /> </RedirectAuthenticatedUser>} />
      <Route path='/verify-email' element={<EmailVerificationPage />} />
      <Route path='/forgot-password' element={
        <RedirectAuthenticatedUser>
        <ForgotPasswordPage/>
        </RedirectAuthenticatedUser>} />
    <Route path='/reset-password/:token' element={
      <RedirectAuthenticatedUser><ResetPasswordPage/></RedirectAuthenticatedUser>
    } />
    
    {/* catch all routes */}

    <Route path='*' element={
      <div className='text-white text-2xl d-flex flex-col items-center justify-center h-screen'>
        <h1>404 Not Found</h1>
        <p>Page not found</p>
      </div>
    } />
    </Routes>
    <Toaster />
    </div>
  )
}

export default App
