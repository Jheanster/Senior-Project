import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Screens
import HomeScreen from './screens/HomeScreen'
import DetailsScreen from './screens/DetailsScreen'
import SettingsScreen from './screens/SettingsScreen'
import ChatScreen from './screens/ChatScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ModalScreen from './screens/ModalScreen';

// Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';
const loginName = 'Login';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function EditProfile(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Settings' component={SettingsScreen}/>
            <Stack.Screen name='Edit Profile' component={EditProfileScreen}/>
        </Stack.Navigator>
    )
}

function MainApp(){
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='Home' component={HomeScreen}/>
                
            </Stack.Navigator>
        </NavigationContainer>
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
                </Stack.Group>

                <Stack.Group screenOptions={{presentation: 'modal'}}>
                    <Stack.Screen name='Modal' component={ModalScreen}/>
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen name='Edit' component={EditProfile}/>
                </Stack.Group>      
            </Stack.Navigator>
        </NavigationContainer>
    )
}