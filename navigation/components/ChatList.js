import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, setDoc, query, where, getDocs, getDoc, doc } from "@firebase/firestore";
import { docDB } from '../../firebase';
import tw from 'twrnc';
import { getLocalUserData } from '../../backend/UserDBService';
import ChatRow from './ChatRow';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';

const ChatList = () => {
  const [matches, setMatches] = useState([]);
  const localUser = getLocalUserData();

  useEffect(() =>
    onSnapshot(
      query(
        collection(docDB, 'matches'), 
        where('usersMatched', 'array-contains', localUser.id)
      ), 
      async (snapshot) => {
        const updatedMatches = await Promise.all(
          snapshot.docs.map(async (docu) => {
            const { usersMatched, ...restOfData } = docu.data();
            const otherUserId = usersMatched.find(userId => userId !== localUser.id);

            // Fetch the most up-to-date user data
            const otherUserDoc = await getDoc(doc(docDB, 'users', otherUserId));
            const localUserDoc = await getDoc(doc(docDB,'users',localUser.id));
            // console.log("Other user doc: ", otherUserDoc.data())
            // console.log("Other user ID: ", otherUserId)
            // console.log(localUserDoc.data().pfp)


            // Create a new object with the updated otherUser information
            const updatedMatch = {
              id: docu.id,
              usersMatched: docu.data().usersMatched,
              ...restOfData,  // Include the rest of the data from the original doc
              otherUser: otherUserDoc.data(),  // Update the otherUser field
              localUser: localUserDoc.data(),
            };

            return updatedMatch;
          })
        );

        // console.log("Updated Matches: ", updatedMatches)
        setMatches(updatedMatches);
      }
    ),
    [localUser, docDB]
  );

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
  );
}

export default ChatList;
