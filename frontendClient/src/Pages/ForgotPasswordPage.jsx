import React from 'react'
import {motion} from 'framer-motion';
import { useState } from 'react';
import { userAuthStore } from '../store/authStore';
import Input from '../components/Input';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';


const ForgotPasswordPage = () => {
    const [email,setEmail] =useState("");
    const [isSubmitted,setIsSubmitted] = useState(false);
    const {isLoading,forgotPassword}= userAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    }


  return (
    <motion.div initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5}}
        className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-gray-700 p-8 mx-auto mt-10'>

        <div className='p-8'>
                <h2 className='text-3xl fornt-bold text-center text-white mb-6 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Forgot Password</h2>
       
            {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                        <p className='text-gray-300 mb-6 text-center'>
                            Enter your email address below and we will send you a link to reset your password.
                        </p>

                        <Input icon={Mail} type='email' placeholder='Email Address' value={email}
                        onChange ={(e)=>setEmail(e.target.value)} required
                        />
                        <motion.button 
                        whileHover={{scale:1.02}}
                        whileTap={{scale:0.98}}
                        className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg mt-4'
                        type='submit'
                        // disabled={isLoading}
                        >
                            {isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Send Reset Link"}
                        </motion.button>
                        <p className='text-gray-300 text-center mt-4'>
                            Remembered your password? <Link to="/login" className='text-green-500 hover:underline'>Login</Link>
                        </p>
                </form>    
            ):(
                <div className='text-center'>
                    <motion.div
                    initial={{scale:0}}
                    animate={{scale:1}}
                    transition={{type:"spring",stiffness:500,damping:30}}
                    className='w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center'>
                        <Mail className='text-white w-8 h-8' />
                    </motion.div>
                    <p className='text-xl text-justify text-gray-300 mb-6'>If you have an account exists for {email} , you will receive a password reset link shortly.

                    </p>
                </div>
               

            )}
             <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
                <Link to={'/login'} className='text-sm text-green-400 hover:underline flex items-center'>
                    <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                </Link>
             </div>
        </div>    


    </motion.div>
  )
}

export default ForgotPasswordPage
