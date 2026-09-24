import React, { useEffect } from 'react'
import { motion } from "motion/react";
import { FaTimes } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import Auth from '../Pages/Auth'

function AuthModel({onclose}) {
    const {userData}= useSelector((state)=>state.user)

    useEffect(()=>{
        if(userData){
            onclose()
        }
    },[userData, onclose])

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className='fixed inset-0 bg-[#14171B]/40 dark:bg-black/60 backdrop-blur-sm flex justify-center items-center z-999 px-4'
        onClick={onclose}
    >
        <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className='relative w-full max-w-md'
        >
            <span className='pointer-events-none absolute -top-px left-10 right-10 h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 dark:via-[#E8A94C]/30 to-transparent z-10' />
            <button
                onClick={onclose}
                aria-label="Close"
                className='absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-xl border border-[#E8E6E1] dark:border-[#232830] text-[#5B636E] dark:text-[#8B92A0] hover:text-[#14171B] dark:hover:text-white hover:border-[#9A7B24]/50 transition cursor-pointer bg-white/70 dark:bg-[#111318]/70 backdrop-blur'>
                <FaTimes size={14}/>
            </button>
            <Auth isModel={true}/>
        </motion.div>
    </motion.div>
  )
}

export default AuthModel
