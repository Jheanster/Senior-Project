import { View, Text, StyleSheet, TouchableOpacity, Button, ImageBackground, TextInput } from 'react-native'
import React , { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'

import { getLocalUserData, updateLocalUserInDB } from '../../backend/UserDBService'

const EditProfileScreen = () => {
    const[email,setEmail] = useState('')
    const[name,setName] = useState('')
    const[address,setAddress] = useState('')
    const[bio,setBio] = useState('')



    const localUser = getLocalUserData();
    //console.log(localUser)


    const submitNewData = () => {

        // If they didnt put anything, just change what they did put
        const data = {
            email: email,
            name: name,
            address: address,
            bio: bio,
        }

        updateLocalUserInDB(data)
    }


  return (
    <SafeAreaView>
        
        <View style={styles.container}>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {}}>
                        <View style={{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <ImageBackground source={{uri: localUser.pfp}}
                            style={{height: 100, width: 100}}
                            imageStyle={{borderRadius: 15}}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Icon name="camera" size={35} color='#fff'
                                        style={{
                                            opacity: 0.7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                    <Text style={{marginTop: 10, fontSize: 18, fontWeight: 'bold'}}>{localUser.name}</Text>
                </View>

                {/* Text input fields */}
                <View style={styles.action}>
                    <FontAwesome name='user-o' size={20}/>
                    <TextInput
                        placeholder='Full Name'
                        value={name}
                        onChangeText={text => setName(text)}
                        placeholderTextColor='#666666'
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name='envelope-o' size={20}/>
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType='email-address'
                        placeholderTextColor='#666666'
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.action}>
                    <Icon name='map-marker-outline' size={20}/>
                    <TextInput
                        placeholder='Address'
                        value={address}
                        onChangeText={text => setAddress(text)}
                        placeholderTextColor='#666666'
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.action}>
                    <FontAwesome name='user-o' size={20}/>
                    <TextInput
                        placeholder='Bio'
                        value={bio}
                        onChangeText={text => setBio(text)}
                        placeholderTextColor='#666666'
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <TouchableOpacity style={styles.commandButton} onPress={submitNewData}>
                    <Text style={styles.panelButtonTitle}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    </SafeAreaView>

 
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
    },

    backButton:{
        backgroundColor:'#0782f9',
        width:'40%',
        padding:15,
        borderRadius:10,

        alignItems: 'center',
        marginTop:40,

        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: 20,
        marginLeft: 20,
    },

    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },

    buttonContainer:{
        marginVertical: 20,
        height: 40,
        marginHorizontal: 10,
        backgroundColor: '#5d57ff',
        justifyContent: 'center',
        alignItems: 'center'
    },

    action:{
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        paddingBottom: 5,
    },

    textInput:{
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },

    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
      },

      panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
      },
})