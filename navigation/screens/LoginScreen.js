
import { useNavigation } from '@react-navigation/core'
import React , { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, StatusBar, Animated } from 'react-native'
import { Easing } from 'react-native-reanimated';
import { auth } from '../../firebase'
import MainContainer from '../MainContainer'
import { registerUser, loginUser, loadLocalUserData, loadProspectsData } from '../../backend/UserDBService'


 function LoginScreen({navigation}) {
    let rotateValueHolder = new Animated.Value(0)

    const[email,setEmail] = useState('')
    const[password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)



    useEffect(() => {
        const unsubcribe =  auth.onAuthStateChanged(user => {
            if (user) {
                loadLocalUserData(user.email, () => loadProspectsData(() => navigation.navigate('MainApp')));
            }
        })

        return unsubcribe
    }, [])


    const startLoadingImage = () => {
        rotateValueHolder.setValue(0)
        Animated.timing(rotateValueHolder,{
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => startLoadingImage())
    }

    const RotateData = rotateValueHolder.interpolate({
        inputRange: [0,1],
        outputRange: ['0deg','360deg']
    })

    const handleSignUp = () => {
        setLoading(true)
        const data = {
            email: email.toLowerCase(),
            password: password,
        }

        registerUser(data)
            .then(response => {
                console.log("Successfully added user login with email: '" + data.email + "'")
                handleLogin()
            })
            .catch(err => {
                alert(err)
            })
    }

    const handleLogin = () => {
        setLoading(true)
        const data = {
            email: email.toLowerCase(),
            password: password,
        }

        loginUser(data)
            .then(response => {
                console.log("Successfully logged in with: '" + response.user.email + "'")
                loadLocalUserData(response.user.email, () => {
                    loadProspectsData(() => {
                        navigation.navigate('MainApp')
                    })
                });
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
            {loading ? (
                startLoadingImage(),
                <Animated.Image
                    style={[
                        styles.imageStyle,
                        {transform: [{rotate: RotateData }]}
                    ]}
                    resizeMode='contain'
                    source={require('../../assets/images/dumbbell.png')}
               />
                 ) : (
                <Image
                    style={styles.imageStyle}
                    resizeMode='contain'
                    source={require('../../assets/images/SpotMeLogo.png')}
                />
            )}
           
            <TextInput
                placeholder='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                placeholder='Password'r
                value={password }
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
            />
        </View>

        <View>
            <Text 
                style={{color: 'white', padding: 10}}
            >
                Forgot Password    
            </Text>
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
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
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
    },

    imageStyle:{
        width: 250, 
        alignSelf: 'center',
    },

})