import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { registerUser, loginUser, loadLocalUserData, loadProspectsData } from '../../backend/UserDBService'

 function LoginScreen({navigation}) {
    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')

    const handleSignUp = () => {

        const data = {
            email: email.toLowerCase(),
            password: password,
        }

        registerUser(data)
            .then(response => {
                console.log("Successfully added user login with email: '" + data.email + "'")
            })
            .catch(err => {
                alert(err)
            })
    }

    const handleLogin = () => {

        const data = {
            email: email.toLowerCase(),
            password: password,
        }

        loginUser(data)
            .then(response => {
                console.log("Successfully logged in with: '" + response.user.email + "'")
                loadLocalUserData(response.user.email, () => loadProspectsData(() => navigation.navigate('MainApp')));
            })
            .catch(err => {
                alert(err);
            })
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