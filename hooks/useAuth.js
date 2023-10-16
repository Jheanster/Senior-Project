import { View, Text } from 'react-native'

import { auth } from '../firebase.js'
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')


    useEffect(
        () => 
            auth.onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUser(user)
                } else {
                    setUser(null)
                }
        }),
        []
    )

    // Signs out the user 
    const handleSignOut = () => {
        auth.signOut()
        .catch(error => alert(error.message))
    }


    // Signs up the user if they dont have a account
    const handleSignUp = () => { 
        auth.createUserWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            setEmail(user.email);
            setPassword(user.password);

            console.log('Registered with:',user.email);
        })
        .catch(error => alert(error.message))
    }

    // Logs in the user if they have a account
    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            setEmail(user.email);
            setPassword(user.password);
            console.log('Logged in with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    // Caches the different states of user, login, etc
    const memoedValue = useMemo(() => ({
        user,
        handleLogin,
        handleSignUp,
        handleSignOut, 
        email,
        password,
    }), [user])

    return (
        <AuthContext.Provider
            value={memoedValue}
        >
            {children}   
        </AuthContext.Provider>
    )
}

export default function useAuth(){
    return useContext(AuthContext);
}