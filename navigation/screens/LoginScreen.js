import { useNavigation } from '@react-navigation/core'
import React , { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { auth } from '../../firebase'
import MainContainer from '../MainContainer'
import {addLocalUserToDB, loadLocalUserData, loadProspectsData} from '../../backend/UserDBService'


 function LoginScreen({navigation}) {
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')


    useEffect(() => {
        const unsubcribe =  auth.onAuthStateChanged(user => {
            if (user) {
                loadLocalUserData(user.email, () => loadProspectsData(() => navigation.navigate('MainApp')));
            }
        })

        return unsubcribe
    }, [])

    const handleSignUp = () => { 
        
        auth.createUserWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    const handleLogin = () => {
        auth.signInWithEmailAndPassword(email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
        })
        .catch(error => alert(error.message))
    }

    return (
        

        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
        <View style={styles.inputContainer}>
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'
                value={password }
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>


        </View>


        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({

    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d91129',
    },

    inputContainer:{
        width:'80%',
    },

    input:{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },

    button:{
        backgroundColor:'#0782f9',
        width:'100%',
        padding:15,
        borderRadius:10,
        alignItems: 'center',
    },

    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },

    buttonContainer:{
        width: '60%',
        justifyContent:'center',
        alignItems: 'center',
        marginTop:40,
    },

    buttonOutline:{
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782f9',
        borderWidth: 2,
    },

    buttonOutlineText:{
        color: '#0782f9',
        fontWeight: '700',
        fontSize: 16,
    },


    titleText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 50,
        marginBottom:250,
    }


})