import React from 'react'
import {BsRobot} from 'react-icons/bs'
import {IoSparkles} from 'react-icons/io5'
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
            let user = response.user
            let name = user.displayName
            let email = user.email
            const result = await axios.post(ServerUrl + "/api/auth/google", {name, email}, {withCredentials : true})
            dispatch(setUserData(result.data))
        }catch(error){
                console.log(error)
                dispatch(setUserData(null))
        }
    } 



  return (
    <div className={`w-full 
    ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex justify-center items-center px-6 py-20"}`
    }>
        <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.05 }}

        className={`
        w-full
        ${isModel ? "max-w-md rounded-3xl p-6" : "max-w-lg p-12 rounded-4xl"}
         bg-white  shadow-2xl border border-gray-200`}>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18} />
                </div>
                <h2 className='text-xl font-semibold text-gray-800'>InterviewIQ.AI</h2>
            </div>
            <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                Continue with
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                    <IoSparkles size={16} />
                    AI Smart Interview
                     </span>
                </h1>
                <p className='text-center text-gray-500 text-sm mb-8 leading-relaxed md:text-base'>
                        Sign in to start your AI-powered interview mock interview and get personalized feedback to improve your performance.
                </p>


                <motion.button
                onClick={handleGoogleAuth}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className='w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-full shadow-md '>
                    <FcGoogle size={20} />
                    Sign in with Google
                </motion.button>
        </motion.div>
    </div>
  )
}

export default Auth


