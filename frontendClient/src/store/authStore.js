import {create} from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true; // Enable sending cookies with requests
export const userAuthStore = create((set) =>({
    user:null,
    isAuthenticated:false,
    error:null,
    isLoading:false,
    isCheckingAuth:true,
    message:null,

    signup:async(email,password,username) => {
        set({isLoading:true,error:null});
        try{
            const response = await axios.post(`${API_URL}/signup`,{email,password,username});
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
        }catch(error){
            console.error("Signup error:",error.message);
            set({error:error.response.data.message || "Error signing up",isLoading:false});
            throw error;
        }
    },
    login:async(email,password) => {
        set({isLoading:true,error:null});
        try{
            const response = await axios.post(`${API_URL}/login`,{email,password});
            set({user:response.data.user,isAuthenticated:true,isLoading:false,error:null});
            // return response.data;
        }catch(error){

            console.error("Login error:",error.message);
            set({error:error.response.data?.message || "Error logging in",isLoading:false});
            throw error;
        }
    },
    logout:async() => {
        set({isLoading:true,error:null});
        try{
            const response = await axios.post(`${API_URL}/logout`);
            set({user:null,isAuthenticated:false,isLoading:false});
            // return response.data;
        }catch(error){
            console.error("Logout error:",error.message);
            set({error: "Error logging out",isLoading:false});
            throw error;
        }},
    verifyEmail :async(code) => {
        set({isLoading:true,error:null});
        try{
            const response = await axios.post(`${API_URL}/verify-email`,{code});
            set({user:response.data.user,isAuthenticated:true,isLoading:false});
            // return response.data;
        }catch(error){
            console.error("Verify email error:",error.message);
            set({error:error.response?.data?.message || "Error verifying email",isLoading:false});
            throw error;
        }
    },
    checkAuth: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay
        set({isCheckingAuth: true, error: null});  
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        }catch (error) {
            console.error("Check auth error:", error);
            set({error: null, isAuthenticated: false, isCheckingAuth: false});
        }
    },
    forgotPassword :async(email) => {
        set({isLoading:true,error:null});
        try{
            const response = await axios.post(`${API_URL}/forgot-password`,{email});
            set({message:response.data.message,isLoading:false});
        }catch(error){
            console.error("Forgot password error:",error.message);
            set({error:error.response?.data?.message || "Error sending reset password email",isLoading:false});
            throw error;
        }
    },
    resetPassword :async(token,password) => {
        set({isLoading:true,error:null});
        try{
            const response =await axios.post(`${API_URL}/reset-password/${token}`,{password});
            set({message:response.data.message ,isLoading:false});   
        }catch(error){
            console.error("Reset password error:",error.message);
            set({error:error.response?.data?.message || "Error resetting password",isLoading:false});
            throw error;
        }
    },
}));
