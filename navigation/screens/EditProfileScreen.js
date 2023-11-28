import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Alert } from 'react-native'
import React , { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { firebase } from '../../firebase'
import { getLocalUserData, updateLocalUserInDB } from '../../backend/UserDBService'

const EditProfileScreen = () => {
    const[email,setEmail] = useState('')
    const[name,setName] = useState('')
    const[address,setAddress] = useState('')
    const[bio,setBio] = useState('')
    const [image,setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const localUser = getLocalUserData();
    //console.log(localUser)

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    // Change this function
    const uploadMedia = async () => {
        setUploading(true);
    
        try {
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = 'blob'
                xhr.open('GET', uri, true);
                xhr.send(null);
            });
    
            // Use localUser.id as the filename and upload to 'pfps/' directory
            const filename = `pfps/pfp-${localUser.id}.png`;
            const ref = firebase.storage().ref().child(filename);
    
            await ref.put(blob);

              // Get the download URL of the uploaded image
            const downloadURL = await ref.getDownloadURL();

            // Update the user document in Firestore with the new 'pfp' field
            await firebase.firestore().collection('users').doc(localUser.id).update({
                pfp: downloadURL,
            });

            setUploading(false);
            Alert.alert("Photo uploaded");
            setImage(null);
    
        } catch (error) {
            console.error(error);
            setUploading(false);
        }
    };

    const submitNewData = () => {
        // If they didnt put anything, just change what they did put
        const data = {
            email: email !== '' ? email : localUser.email ,
            name: name !== '' ? name : localUser.name,
            address: address !== '' ? address : localUser.address,
            bio: bio !== '' ? bio : localUser.bio,
        }
        updateLocalUserInDB(data)
        uploadMedia();
    }


  return (
    <SafeAreaView>
        
        <View style={styles.container}>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <View style={{alignItems: 'center'}}>

                    {/* Camera button */}
                    <TouchableOpacity onPress={pickImage}>
                        <View style={{
                            height: 100,
                            width: 100,
                            borderRadius: 15,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            {/* Change to display the selected image if the user selected an image */}
                            <ImageBackground source={{uri: image !== null ? image : localUser.pfp}}
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