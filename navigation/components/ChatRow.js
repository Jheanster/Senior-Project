import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getLocalUserData, listenForMostRecentMessage, loadMatchedProspect } from '../../backend/UserDBService';
import { collection, doc, onSnapshot, setDoc, query, where, getDocs, getDoc, serverTimestamp, addDoc, orderBy } from "@firebase/firestore"
import tw from "twrnc"
import { docDB } from '../../firebase';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation()
    const [matchedUser, setMatchedUser] = useState(null)
    const [lastMessage, setLastMessage] = useState(null)

    useEffect(
        () => {
            loadMatchedProspect(matchDetails, (loadedUser) => setMatchedUser(loadedUser))
            const unsubscribe = listenForMostRecentMessage(
                matchDetails, (loadedMessage) => setLastMessage(loadedMessage)
            )
            return unsubscribe
        },
        [matchDetails]
    )

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
                source={matchedUser ? { uri: matchedUser.pfp} : null}
            />

            <View>
                <Text style={tw`text-lg font-semibold`}>
                    {matchedUser?.name}
                </Text>
                <Text>{lastMessage?.text || "Say Hi!"}</Text>
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