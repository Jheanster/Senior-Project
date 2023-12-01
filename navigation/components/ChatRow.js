import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getLocalUserData, loadLastMessage, loadMatchedProspect } from '../../backend/UserDBService';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';
import { collection, doc, onSnapshot, setDoc, query, where, getDocs, getDoc, serverTimestamp, addDoc, orderBy } from "@firebase/firestore"
import tw from "twrnc"
import { docDB } from '../../firebase';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation()
    const localUser = getLocalUserData()
    const [matchedUser, setMatchedUser] = useState(null)
    const [lastMessage, setLastMessage] = useState(null)

    useEffect(
        () => loadLastMessage(matchDetails, (message) => setLastMessage(message)),
        [matchDetails]
    )

    useEffect(
        () => loadMatchedProspect(matchDetails, (user) => setMatchedUser(user)),
        [matchDetails, localUser]
    )

    //console.log("Matched user info: ", matchedUserInfo)

  return (
    <TouchableOpacity 
        style={[tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`, styles.cardShadow]}
        onPress={() => {
            navigation.navigate('Message',{
                matchDetails,
            })
        }}
    >
        <Image
            style={tw`rounded-full h-16 w-16 mr-4`}
            source={{ uri: matchedUser?.pfp}}
        />

        <View>
            <Text style={tw`text-lg font-semibold`}>
                {matchedUser?.name}
            </Text>
            <Text>{lastMessage ? lastMessage.text : "Say Hi!"}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
})