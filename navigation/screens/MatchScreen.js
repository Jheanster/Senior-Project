import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import tw from 'twrnc'

const MatchScreen = () => {
    const navigation = useNavigation();
    const { params } = useRoute();

    const { localUser, userSwiped } = params;

  return (
    <View style={[tw`h-full bg-red-500 pt-20`, {opacity: 0.89}]}>

      <View>
        <Text style={[tw`text-white text-center mt-15 font-bold text-4xl tracking-wide`]}>Grind time!</Text>

        <Text style={tw`text-white text-center mt-5`}>
          You and {userSwiped.name} have liked each other.
        </Text>
      </View>

      <View style={tw`flex-row justify-evenly mt-5`}>
        <Image 
          style={tw`h-32 w-32 rounded-full`}
          source={localUser.pfp ? {uri: localUser.pfp} : null}
        />
        <Image 
          style={tw`h-32 w-32 rounded-full`}
          source={userSwiped?.pfp ? {uri: userSwiped.pfp} : null}
        />
      </View>

      <TouchableOpacity 
        style={tw`bg-white m-5 px-10 py-8 rounded-full mt-20`}
        onPress={() => {
          navigation.goBack();
          navigation.navigate('Chat');
        }}
      >
        <Text style={tw`text-center text-lg`}>
          Send a message
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default MatchScreen