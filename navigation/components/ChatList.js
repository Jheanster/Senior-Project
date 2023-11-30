import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, setDoc, query, where, getDocs, getDoc, serverTimestamp } from "@firebase/firestore"
import { docDB } from '../../firebase';
import tw from 'twrnc'
import { getLocalUserData } from '../../backend/UserDBService';
import ChatRow from './ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const localUser = getLocalUserData()

    useEffect(
        () => loadLocalUserMatches((loadedMatches) => setMatches(loadedMatches)),
        [localUser]
    )

    //console.log("matches: ", matches)

  return (
    matches.length > 0 ? (
        <FlatList
            style={tw`h-full`}
            data={matches}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ChatRow matchDetails={item}/>}
        />
    ) : (
        <View style={tw`p-5`}>
            <Text style={tw`text-center text-lg`}>No matches at the moment</Text>
        </View>
    )
    
  )
}

export default ChatList