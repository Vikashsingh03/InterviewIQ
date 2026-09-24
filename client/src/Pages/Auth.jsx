import React from 'react'
import {motion} from 'motion/react'
import {FcGoogle} from 'react-icons/fc'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/firebase'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function Auth({isModel = false}) {
    const dispatch = useDispatch()

    const handleGoogleAuth = async()=>{
        try{
            const response = await signInWithPopup(auth, provider)
            const idToken = await response.user.getIdToken()
            const result = await axios.post(ServerUrl + "/api/auth/google", {idToken}, {withCredentials : true})
            dispatch(setUserData(result.data))
        }catch(error){
                console.log(error)
                dispatch(setUserData(null))
        }
    }



  return (
    <div className={`w-full
    ${isModel ? "py-4" : "min-h-screen bg-[#FAFAF9] dark:bg-[#0A0B0D] flex justify-center items-center px-6 py-20"}`
    }>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
          .auth-root, .auth-root * { font-family: 'Manrope', sans-serif; }
          .auth-root .font-serif-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
          .auth-root .font-mono-studio { font-family: 'JetBrains Mono', monospace; }
        `}</style>
        <motion.div
         initial={{ opacity: 0, y: 24, scale: 0.98 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         transition={{ duration: 0.5, ease: "easeOut" }}

        className={`
        auth-root relative overflow-hidden w-full
        ${isModel ? "max-w-md rounded-3xl p-7 sm:p-8" : "max-w-lg p-10 sm:p-12 rounded-3xl"}
         bg-white dark:bg-[#0C0E11] border border-[#E8E6E1] dark:border-[#232830] shadow-[0_24px_60px_-30px_rgba(20,23,27,0.16)]`}>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="absolute top-0 left-10 right-10 h-px bg-linear-to-r from-transparent via-[#9A7B24]/40 dark:via-[#E8A94C]/30 to-transparent origin-center"
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className='flex items-center justify-center gap-3 mb-7'
            >
                <div className='bg-[#14171B] dark:bg-[#EDEEF0] p-2.5 rounded-xl flex items-center justify-center'>
                    <span className='w-3 h-3 rotate-45 bg-[#9A7B24] dark:bg-[#E8A94C] block' />
                </div>
                <h2 className='font-mono-studio text-sm font-semibold tracking-[0.18em] text-[#14171B] dark:text-[#EDEEF0]'>InterviewIQ.AI</h2>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className='font-serif-display text-3xl md:text-4xl tracking-tight text-center leading-snug mb-4 text-[#14171B] dark:text-[#EDEEF0]'
            >
                Continue with<br />
                <span className='inline-block mt-2 px-4 py-1.5 rounded-full border-2 border-[#9A7B24] dark:border-[#E8A94C] text-[#9A7B24] dark:text-[#E8A94C] text-2xl md:text-3xl'>
                    AI Smart Interview
                </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className='text-center text-[#3E4650] dark:text-[#9AA1AC] text-sm mb-8 leading-relaxed md:text-base'
            >
                Sign in to start your AI-powered interview mock interview and get personalized feedback to improve your performance.
            </motion.p>


            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              onClick={handleGoogleAuth}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className='w-full flex items-center justify-center gap-3 bg-[#14171B] dark:bg-[#EDEEF0] text-white dark:text-[#0A0B0D] font-semibold py-3.5 rounded-2xl cursor-pointer'
            >
                <FcGoogle size={20} />
                Sign in with Google
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              className='font-mono-studio text-[10px] tracking-[0.2em] text-center text-[#5B636E] dark:text-[#565D68] mt-6'
            >
                SECURE · ONE-CLICK · NO PASSWORD
            </motion.p>
        </motion.div>
    </div>
  )
}

export default Auth
