import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
// import { verifyEmail } from '../../../backend/controllers/auth.controller';
import toast from 'react-hot-toast';


import { userAuthStore } from "../store/authStore";
const EmailVerificationPage = () => {
    const [code,setCode] = useState(["","","","","",""]);
    const inputRefs= useRef([]);
    const navigate = useNavigate();
    const isLoading=false;
  const {verifyEmail} = userAuthStore();
        

        const handleChange = (index,value) =>{
            const newCode = [...code];

            // Handled pasted Content
            if(value.length >1 ){
                const pastedCode= value.slice(0,6).split("");
                for(let i =0 ; i<6 ; i++){
                    newCode[i] = pastedCode[i] || "";
                }
                setCode(newCode);

                // Focus on the last non-empty input or the first empty One
                const lastFilledIndex = newCode.findLastIndex((digit)=>digit !== "");
                const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
                inputRefs.current[focusIndex].focus();
            }else{
                newCode[index]=value;
                setCode(newCode);

                // Move focus to the next input field if value if entered
                if(value && index < 5){
                    inputRefs.current[index + 1].focus();
                }
            }
        };
        const handleKeyDown = (index,e) =>{
            if(e.key === 'Backspace' && !code[index] && index>0){
                inputRefs.current[index-1].focus();
            }
        };

        const handleSubmit = async(e) => {
            e.preventDefault();
            const verificationCode = code.join("");
            try{
                await verifyEmail(verificationCode);
                navigate("/");
                toast.success("Email verified successfully");
            }catch(error){
                console.error("Verification error:",error);
            }
        };
        // Autosubmit when all fields are filled
        useEffect(()=>{
            if(code.every(digit => digit !== "")){
                handleSubmit(new Event('submit'));
            }
        },[code]);
  return (
    <div className='max-w-md w-full bg-gray-800 bg-opacity-50 bachdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-4 '>
         <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 bachdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden" >
       
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text" >Verify Your Email</h2>
            <p className='text-center text-gray-300 mb-6'>Enter the 6 digit code sent to your email address.</p>
            <form onSubmit={handleSubmit} className='space-y-6' >
                <div  className='flex justify-between'>
                    {code.map((digit,index)=>(
                          <input
                          key={index}
                          ref={(el)=>(inputRefs.current[index]=el)}
                          type='text'
                          maxLength='6'
                          value={digit}
                          onChange={(e)=>handleChange(index,e.target.value)}
                          onKeyDown={(e)=>handleKeyDown(index,e)}
                          className="w-full p-2 pl-6 ml-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200"
                        />
                ))};
               </div>
              <motion.button className="mt-5 w-full py-3 px-4 bg-gradient-to-t from-green-500 to-emerald-600 text-white font-bold
              rounder-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 "
              whileHover={{scale:1.02}} whileTap={{scale:0.98}} type="submit" disabled={isLoading || code.some((digit)=> !digit)}>
                {isLoading ? "Verifying...": "Verify Email"}
                </motion.button>   
               
          
            </form>
        
    </motion.div>
        </div>
  )
}

export default EmailVerificationPage
