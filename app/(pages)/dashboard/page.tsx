'use client'

import { axiosInstance } from '@/app/lib/axiosInstance'
import { deleteCookie, getCookie } from 'cookies-next'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

type User = {
    fullName: string,
    email: string,
    _id: string,
    avatar: string
    posts: string[]
}

type Post = {
    _id: string
    title: string,
    content: string,
    user: Omit<User, 'posts'>
}

export default function Dashboard() {

    const [user, setUser] = useState<User | null>(null)
    const [posts, setPosts] = useState<Post[]>([])
    const [users, setUsers] = useState<User[]>([])
    const router = useRouter()

    const getCurrentUser = async (token: string) => {
        try {
            const res = await axiosInstance.get('/auth/current-user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setUser(res.data)
        } catch (e) {
            router.push('/sign-in')
        }
    }

    const getAllPosts = async (token: string) => {
        const res = await axiosInstance.get('/posts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setPosts(res.data)
    }

    const getAllUsers = async (token: string) => {
        const res = await axiosInstance.get('/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setUsers(res.data)
    }

    const deletePost = async (id: string) => {
        try {
            const token = getCookie('accessToken')
            const res = await axiosInstance.delete(`/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.status === 200) {
                toast.success('deleted successfully')
                await getAllPosts(token as string)
            }
        } catch (e) {
            toast.error('permision denied')
        }
    }

    const signOut = () => {
        deleteCookie('accessToken')
        router.push('/sign-in')
    }

    useEffect(() => {
        const token = getCookie('accessToken')
        getCurrentUser(token as string)
        getAllPosts(token as string)
        getAllUsers(token as string)
    }, [])

    if (!user) return null

    return (
        <div>
            <ToastContainer />
            <h1>Dashboard</h1>
            <div className='flex gap-2'>
                <h1>{user.email}</h1>
                <Image 
                    src={user.avatar}
                    alt={user.avatar}
                    width={30}
                    height={30}
                />
            </div>
            <button onClick={signOut} className='bg-blue-600 p-2 rounded-sm text-white font-semibold'>Sign Out</button>
            <div className='border-2 border-black p-3'>
                {users.map(u => (
                    <div key={u._id} className='flex gap-2 border-2 m-1 border-black'>
                        <h2>{u.email}</h2>
                        <h2>{u.fullName}</h2>
                    </div>
                ))}
            </div>
            <div className='flex gap-3'>
                {posts.map(el => (
                    <div key={el._id} className='size-[200px] border-2 border-black p-3 rounded-lg'>
                        <h1>title: {el.title}</h1>
                        <h1>content: {el.content}</h1>
                        <h1>email: {el?.user?.email}</h1>
                        <button onClick={() => deletePost(el._id)} className='bg-red-500 text-white p-2'>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
