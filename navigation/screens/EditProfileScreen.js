import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, TextInput, Alert, ScrollView } from 'react-native'
import React , { useState } from 'react'
import Checkbox from '../components/Checkbox'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
import { getLocalUserData, updateLocalUserInDB, updateLocalUserPFPInDB } from '../../backend/UserDBService'
import { assignCoordsFromAddress } from '../../backend/UserLocationService'
import Slider from '@react-native-community/slider'
import Header from '../components/Header'
import tw from 'twrnc'

const EditProfileScreen = () => {
    const localUser = getLocalUserData();

    const [name, setName] = useState(localUser.name)
    const [bio, setBio] = useState(localUser.bio)
    const [address, setAddress] = useState(localUser.address)
    const [city, setCity] = useState(localUser.city)
    const [province, setProvince] = useState(localUser.state) //referring to states as 'provinces' to avoid confusion
    const [country, setCountry] = useState(localUser.country)
    const [image, setImage] = useState(null);
    const [bodybuilding, setIsBodybuildingSelected] = useState(localUser.bodybuilding);
    const [powerlifting, setIsPowerliftingSelected] = useState(localUser.powerlifting);
    const [crossfit, setCrossFitSelected] = useState(localUser.crossfit);
    const [calisthenics, setIsCalisthenicsSelected] = useState(localUser.calisthenics);
    const [running, setIsRunningSelected] = useState(localUser.running);
    const [cycling, setIsCyclingSelected] = useState(localUser.cycling);
    const [weightLoss, setIsWeightLossSelected] = useState(localUser["weight-loss"]); 
    const [generalFitness, setIsGeneralFitnessSelected] = useState(localUser["general-fitness"]);
    const [experience,setExperience] = useState(localUser.experience)

    // console.log(localUser)

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

    const submitNewData = () => {
        const newData = {name, bio, address, city, state: province, country,
                        bodybuilding, calisthenics, running, crossfit, cycling, 
                        "weight-loss": weightLoss, "general-fitness": generalFitness, powerlifting, experience}

        assignCoordsFromAddress(newData, (success) => {
            if(success){
                updateLocalUserInDB(newData)
                if(image !== null){
                    updateLocalUserPFPInDB(image)
                }
                Alert.alert("Profile has been updated");
            }else{
                Alert.alert("Unable to validate address");
            }
        })
    }

  return (
    <SafeAreaView>
        <Header title="Edit Profile"/>
        
        <View style={styles.container}>
            <View style={{marginLeft: 20, marginRight: 20}}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ paddingBottom: 80}}>
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
                                    <ImageBackground source={(image || localUser.pfp) ? {uri: image || localUser.pfp} : null}
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
                            <FontAwesome name='vcard-o' size={20}/>
                            <TextInput
                                placeholder='Bio'
                                value={bio}
                                onChangeText={text => setBio(text)}
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
                            <Icon name='city-variant-outline' size={20}/>
                            <TextInput
                                placeholder='City'
                                value={city}
                                onChangeText={text => setCity(text)}
                                placeholderTextColor='#666666'
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <Icon name='map-outline' size={20}/>
                            <TextInput
                                placeholder='State'
                                value={province}
                                onChangeText={text => setProvince(text)}
                                placeholderTextColor='#666666'
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.action}>
                            <Icon name='flag-variant-outline' size={20}/>
                            <TextInput
                                placeholder='Country'
                                value={country}
                                onChangeText={text => setCountry(text)}
                                placeholderTextColor='#666666'
                                autoCorrect={false}
                                style={styles.textInput}
                            />
                        </View>

                        <Text style={tw`text-center text-lg mb-5 mt-5 font-bold`}>Training Types</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <View>
                                <Checkbox 
                                    text='Running' 
                                    isChecked={running}
                                    onPress={() => setIsRunningSelected(!running)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='Body Building' 
                                    isChecked={bodybuilding}
                                    onPress={() => setIsBodybuildingSelected(!bodybuilding)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='Cross Fit' 
                                    isChecked={crossfit}
                                    onPress={() => setCrossFitSelected(!crossfit)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='Calisthenics' 
                                    isChecked={calisthenics}
                                    onPress={() => setIsCalisthenicsSelected(!calisthenics)}
                                    containerStyle={styles.checkbox}
                                />
                            </View>

                            <View>
                                <Checkbox 
                                    text='Cycling' 
                                    isChecked={cycling}
                                    onPress={() => setIsCyclingSelected(!cycling)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='Weight Loss' 
                                    isChecked={weightLoss}
                                    onPress={() => setIsWeightLossSelected(!weightLoss)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='General Fitness' 
                                    isChecked={generalFitness}
                                    onPress={() => setIsGeneralFitnessSelected(!generalFitness)}
                                    containerStyle={styles.checkbox}
                                />
                                <Checkbox 
                                    text='Power Lifting' 
                                    isChecked={powerlifting}
                                    onPress={() => setIsPowerliftingSelected(!powerlifting)}
                                    containerStyle={styles.checkbox}
                                />
                            </View>
                        </View>

                        <View style={styles.sliderContainer}>
                            <Text style={tw`text-center text-lg mt-5 font-bold`}>Experience Level</Text>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>{experience}</Text>

                            <Slider
                                style={{width: 250, height: 40}}
                                minimumValue={0}
                                maximumValue={100}
                                minimumTrackTintColor='tomato'
                                thumbTintColor='tomato'
                                value={experience}
                                onValueChange={value => setExperience(parseInt(value))}
                            />
                        </View>
                        

                        <TouchableOpacity style={styles.commandButton} onPress={submitNewData}>
                            <Text style={styles.panelButtonTitle}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingBottom: 40}}></View>
                </ScrollView>

                
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
        marginBottom: 10,
    },

    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },

    checkbox: {
       width: '50%',
       padding: '1rem',
    },

    sliderContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})