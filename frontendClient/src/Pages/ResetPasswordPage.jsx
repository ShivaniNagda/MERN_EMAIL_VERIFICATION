import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { userAuthStore } from '../store/authStore';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../components/input';
import toast from 'react-hot-toast';
import { ArrowLeft, Lock } from 'lucide-react';

const ResetPasswordPage = () => {
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const {resetPassword,error,isLoading,message}= userAuthStore();
    
    console.log("ResetPasswordPage rendered",resetPassword,error,isLoading,message);
    const {token} = useParams();
    const navigate = useNavigate();
    console.log("Token from URL:",token);


   const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted",password,confirmPassword); 
    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }
    try {
       const resetsubmitfrontend= await resetPassword(token,password);
       console.log("resetsubmitfrontend ",resetsubmitfrontend);
        toast.success("Password reset successfully. You can now log in with your new password.");
        setTimeout(() => {
        navigate("/login");
        }, 2000);
    } catch (error) {
        console.error("Error resetting password:", error);
        toast.error(error.message || "Failed to reset password. Please try again.");
    }
    };

  return (
    <motion.div 
    initial={{opacity:0,y:20}} 
    animate={{opacity:1,y:0}} 
    transition={{duration:0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 mx-auto mt-10 p-8 overflow-hidden'>
    <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Reset Password</h2>

        {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
        {message && <p className='text-green-500 text-center mb-4'>{message}</p>}


    <form onSubmit={handleSubmit}>
    <Input icon={Lock} type='password' placeholder='New Password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
    <Input icon={Lock} type='password' placeholder='confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>

    <motion.button
    type='submit'
    whileHover={{scale:1.05}}
    whileTap={{scale:0.95}}
    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded
    w-full mt-4 transition duration-200 ease-in-out'
    disabled={isLoading}
    >
        {isLoading ? "Resetting..." : "Set New Password"}
    </motion.button>
    </form>
    </div>
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <Link to={'/login'} className='text-sm text-green-400 hover:underline flex items-center'>
                    <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                </Link>
             </div>
    </motion.div>
  )
}

export default ResetPasswordPage