import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';


// Screens
import HomeScreen from './screens/HomeScreen'

import SettingsScreen from './screens/SettingsScreen'
import ChatScreen from './screens/ChatScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ModalScreen from './screens/ModalScreen';
import MatchScreen from './screens/MatchScreen';
import MessageScreen from './screens/MessageScreen';

// Screen names
const homeName = 'Home';

const settingsName = 'Settings';
const loginName = 'Login';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function EditProfile(){
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='Settings' component={SettingsScreen}/>
            <Stack.Screen name='Edit Profile' component={EditProfileScreen}/>
        </Stack.Navigator>
    )
}



export default function MainContainer(){
    const user = false;
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='Login' component={LoginScreen}/>
                <Stack.Group>
                    <Stack.Screen name='Home' component={HomeScreen}/>
                    <Stack.Screen name='Chat' component={ChatScreen}/>
                    <Stack.Screen name='Message' component={MessageScreen}/>
                </Stack.Group>

                <Stack.Group screenOptions={{presentation: 'modal'}}>
                    <Stack.Screen name='Modal' component={ModalScreen}/>
                </Stack.Group>
                <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
                    <Stack.Screen name='Match' component={MatchScreen}/>
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen name='Edit' component={EditProfile}/>
                </Stack.Group>      
            </Stack.Navigator>
            <StatusBar translucent barStyle='light-color'/>
        </NavigationContainer>
        
    )
}