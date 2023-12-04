import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc';
import { getLocalUserData } from '../../backend/UserDBService';

const ModalScreen = () => {
    const localUser = getLocalUserData();
    const [image, setImage] = useState(null);
    const [bio, setBio] = useState(null);
    const [age, setAge] = useState(null);

    const isComplete = !image || !age || !bio;
    
    console.log('Modal:', isComplete)


  return (
    <View style={tw`flex-1 items-center pt-1`}>
        <Image 
            style={tw`h-20 w-full`}
            resizeMode="contain"
            source={require('../../assets/images/SpotMeLogo.png')}
        />

        <Text style={tw`text-xl text-black p-2 font-bold`}>
            Welcome {localUser.name}
        </Text>

        <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 1: Profile Picture
        </Text>
        <TextInput
            value={image}
            onChangeText={text => setImage(text)}
            style={tw`text-center text-xl pb-2`}
            placeholder='Enter your pfp'

        />

        <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 2: Your Bio
        </Text>
        <TextInput
            value={bio}
            onChangeText={text => setBio(text)}
            style={tw`text-center text-xl pb-2`}
            placeholder='Enter your bio'
        />

        <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 3: Your Age
        </Text>
        <TextInput 
            value={age}
            onChangeText={text => setAge(text)}
            keyboardType='numeric'
            style={tw`text-center text-xl pb-2`} 
            placeholder='Enter your age'

        />
        
        <TouchableOpacity 
            disabled={isComplete}
            style={[tw`w-64 p-3 rounded-xl absolute bottom-10` , 
                isComplete ? tw`bg-gray-400` : tw`bg-red-400`
            ]}
        >
            <Text style={tw`text-center text-white text-xl`}>Update Profile</Text>
        </TouchableOpacity>

    </View>
  )
}

export default ModalScreen