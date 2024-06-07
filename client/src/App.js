import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Dashboard, Home, Login, MusicPlayer } from './components'
import { app } from './config/firebase.config'


import { getAuth, onIdTokenChanged } from 'firebase/auth'

import { AnimatePresence, motion } from 'framer-motion'
import { validateUser } from './api'
import { useStateValue } from './context/StateProvider'
import { actionType } from './context/reducer'

const App = () => {

    //get authentication information
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();

    const [{user, isSongPlaying}, dispatch] = useStateValue();

    //chỉ giữ giá trị boolean ở local storage
    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")

    //check authentication thay doi 
    useEffect(() => {
        //check firebase authen
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    // console.log(token);
                    validateUser(token).then((data) => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data,
                        })
                    })
                })
            } else {
                setAuth(false);
                window.localStorage.setItem("auth", "false");
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                })
                navigate("/login")
            }
        })
    }, [])

    return (
        //wait until animation is complete
        <AnimatePresence mode='wait'>
            <div className='h-auto min-w-[680px] bg-primary flex justify-center items-center'>
                <Routes>
                    <Route path='/login' element={<Login setAuth={setAuth} />} />
                    <Route path='/*' element={<Home />} />
                    <Route path='/dashboard/*' element={<Dashboard />} />
                </Routes>

                {isSongPlaying && (
                    <motion.div
                        initial={{opacity: 0, y: 50}}
                        animate={{opacity: 1, y: 0}}
                        className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center 
                        justify-center`}
                    >
                        <MusicPlayer />
                    </motion.div>
                )}
            </div>
        </AnimatePresence>
    )
}

export default App