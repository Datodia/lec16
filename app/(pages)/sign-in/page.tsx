
'use client'

import { axiosInstance } from "@/app/lib/axiosInstance"
import { SignInFormData, signInSchema } from "@/app/validations/signIn"
import { yupResolver } from "@hookform/resolvers/yup"
import { setCookie } from "cookies-next"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function SignIn() {

  const queryParams = useSearchParams()

  const getCurrentUser = async (token: string) => {
    try{
      const resp = await axiosInstance.get('/auth/current-user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return resp.data

    }catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    const token = queryParams.get('token')
    if(token){
      getCurrentUser(token)
      setCookie('accessToken', token, {maxAge: 60 * 60})
      router.push('/dashboard')
    }
  }, [])

    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(signInSchema)
    })

    const [error, setError] = useState('')
    const router = useRouter()

    const onSubmit = async (data: SignInFormData) => {
        try{
            setError('')
            const res = await axiosInstance.post('/auth/sign-in', data)
            console.log(res, "responseee")
            if(res.status === 200){
                setCookie('accessToken', res.data.token, {maxAge: 60 * 60})
                router.push('/dashboard')
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
        <h1>Sign In</h1>

        <input type="text" placeholder='email' {...register('email')}  />
        <p className="text-red-500">{errors.email?.message}</p>
        <input type="password" placeholder='password' {...register('password')}  />
        <p className="text-red-500">{errors.password?.message}</p>
        <p className="text-red-500">{error}</p>
        <button className="bg-blue-600 text-white">Sign In</button>
        <div className="flex gap-2">
            <span>Dont have account?</span>
            <Link className="text-blue-500" href={'/sign-up'}>Sign Up</Link>
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
