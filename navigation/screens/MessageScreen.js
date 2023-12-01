import { View, Text, SafeAreaView, TextInput, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import getMatchedUserInfo from '../../lib/getMatchedUserInfo'
import { getLocalUserData } from '../../backend/UserDBService'
import { useRoute } from '@react-navigation/native'
import tw from 'twrnc'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { collection, doc, onSnapshot, setDoc, query, where, getDocs, getDoc, serverTimestamp, addDoc, orderBy } from "@firebase/firestore"
import { docDB } from '../../firebase'

const MessageScreen = (props) => {
  const localUser = getLocalUserData()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [matchedUser, setMatchedUser] = useState(null)
  const matchDetails = useRoute()

  useEffect(
    () => {
      loadAllMessages(matchDetails, (loadedMessages) => setMessages(loadedMessages))
      loadMatchedProspect(matchDetails, (loadedUser) => setMatchedUser(loadedUser))
    },
    [matchDetails]
  )

  const sendMessage = () => {
    sendMessage(matchDetails, input)
    setInput("");
  }


  return (
    <SafeAreaView style={tw`flex-1`}>
      <Header 
        title={getMatchedUserInfo(matchDetails.users, localUser.id).name} 
        callEnabled
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1`}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList 
            data={messages}
            inverted={-1}
            style={tw`pl-4`}
            keyExtractor={item => item.id}
            renderItem={({item: message}) => 
              message.userId === localUser.id ? (
                <SenderMessage key={message.id} message={message}/>
              ) : (
                <ReceiverMessage key={message.id} message={message}/>
              )
            }
          />
        </TouchableWithoutFeedback>


        {/* Text input for writting the image */}
        <View style={tw`flex-row justify-between items-center border-t border-gray-200 px-5 py-2`}>
          <TextInput
            style={tw`h-10 text-lg`}
            placeholder='Send message...'
            onChangeText={setInput}
            value={input}
          />
          <Button onPress={sendMessage} title='Send' color="#FF5864"/>
        </View>
      </KeyboardAvoidingView>
    
      
    </SafeAreaView>
  )
}

export default MessageScreen