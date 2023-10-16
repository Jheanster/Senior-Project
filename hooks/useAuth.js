import { View, Text } from 'react-native'
import React from 'react'

const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {

    
    return (
        <AuthContext.Provider
            value={{
                user: "Something",
            }}
        >
            {children}   
        </AuthContext.Provider>
    )
}