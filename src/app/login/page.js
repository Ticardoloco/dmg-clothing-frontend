"use client"
import Link from 'next/link'
import { useForm } from "react-hook-form"
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
   const { register, handleSubmit, formState: { errors } } = useForm();
  //  const{ user} = useAuthStore()

   const router = useRouter()
   const onSubmit = async (data) =>{

     
  
  setLoading(true);
    try {
     
      const response = await fetch("http://localhost:4001/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (!response.ok) {
       if (result.message?.toLowerCase().includes("not exist")) {
          toast.error("User does not exist");
        } else if (result.message?.toLowerCase().includes("invalid")) {
          toast.error("Invalid credentials");
        } else {
          toast.error(result.message || "Login failed");
        }
        return;
      }

      useAuthStore.getState().setAuth({
        token: result.token,
        user: result.user,
      });

      

      if (result) {
        toast.success( `Welcome back ${result.user?.username} 🎉`);
       setTimeout(() => {
         router.push("/")
       }, 1500);
      }
  
      
    } catch (error) {
     toast.error("Server error. Try again.");
    }

    finally{
      setLoading(false);
    }
   }


  return (
    <div className='w-full py-8 sm:py-16'>
      <ToastContainer position="top-right" autoClose={1500} />
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 '>
        <div className='inline-flex items-center gap-2 mb-2 mt-10 font-prata'>
          <p className="text-3xl">
            Login
          </p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
        </div>

   
        <input
         placeholder='Email'
          className='w-full px-3 py-2 border border-gray-800 '
           {...register("email", { 
            required: "Email Address is required",
             pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address"
             } })}
              aria-invalid={errors.email ? "true" : "false"}/>
        {errors.email && <p className='w-full text-left text-red-700 -mt-2' role="alert">{errors.email.message}</p>}

        <div className="relative w-full">
            <input type={showPassword ? "text" : "password"}
         placeholder='Password'
        className='w-full px-3 py-2 border border-gray-800 '
        {...register("password", {
        required: "Password is required",
        minLength: {
      value: 6,
      message: "Password must be at least 6 characters"
    },
     pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]+$/,
      message:
        "Password must include uppercase, lowercase, number, and special character"
    }
      
      })}
      aria-invalid={errors.password ? "true" : "false"}
      />
       <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-gray-600"
  >
    {showPassword ? "Hide" : "Show"}
  </span>
        </div>
      {errors.password && (
  <p className="w-full text-left text-red-700 -mt-2" role="alert">
    {errors.password.message}
  </p>
)}
        

        <div className="w-full flex justify-between text-sm -mt-2">
          <p><Link href="/">Forgot your password?</Link></p>
          <p><Link href="/signup">Create account</Link></p>
          
        </div>

        <input  type="submit" disabled={loading} value={loading? "Loging In...": "Login"} className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer'/>
      </form>
    </div>
  )
}

export default LoginPage
