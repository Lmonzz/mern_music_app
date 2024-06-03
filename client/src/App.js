import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { Home, Login } from './components'
import { app } from './config/firebase.config'


import { getAuth, onIdTokenChanged } from 'firebase/auth'

import { AnimatePresence } from 'framer-motion'
import { validateUser } from './api'
import { useStateValue } from './context/StateProvider'
import { actionType } from './context/reducer'

const App = () => {

    //get authentication information
    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();

    const [{user}, dispatch] = useStateValue();

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
                </Routes>
            </div>
        </AnimatePresence>
    )
}

export default App