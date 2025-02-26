
'use client'

import { axiosInstance } from "@/app/lib/axiosInstance"
import { SignUpFormData, signUpSchema } from "@/app/validations/signUp"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

export default function SignUp() {

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(signUpSchema)
    })

    const [error, setError] = useState('')
    const router = useRouter()

    const onSubmit = async (data: SignUpFormData) => {
        try{
            setError('')
            const res = await axiosInstance.post('/auth/sign-up', data)
            if(res.status === 201){
                router.push('/sign-in')
            }
        }catch(e: any){
            setError(e.response.data.message)
        }
    }

    const signInWithGoogle = () => {
      window.location.href = 'https://nest5.onrender.com/auth/google'
    }

  return (
    <div className='flex items-center flex-col justify-center h-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className="size-[300px] bg-gray-400 p-4 rounded-md flex flex-col gap-2">
        <h1>Sign Up</h1>
        <input type="text" placeholder='fullName' {...register('fullName')}  />
        <p className="text-red-500">{errors.fullName?.message}</p>
        <input type="text" placeholder='email' {...register('email')}  />
        <p className="text-red-500">{errors.email?.message}</p>
        <input type="password" placeholder='password' {...register('password')}  />
        <p className="text-red-500">{errors.password?.message}</p>
        <p className="text-red-500">{error}</p>
        <button className="bg-blue-600 text-white">Sign Up</button>
        <div className="flex gap-2">
            <span>Already Have acoount?</span>
            <Link className="text-blue-500" href={'/sign-in'}>Sign IN</Link>
        </div>
      </form>
      <button onClick={signInWithGoogle} className="mt-3 rounded-sm bg-blue-500 flex p-2 gap-2 font-semibold text-white">
              Sign In With Google
              <Image 
                src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpiP6JDePDwFukzlm8_ACdhrFhTDH47B3UWA&s'}
                alt="google"
                width={30}
                height={30}
              />
            </button>
    </div>
  )
}
