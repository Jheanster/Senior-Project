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

// Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';
const loginName = 'Login';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function MainApp(){
    return(
        <Tab.Navigator 
            initialRouteName={homeName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === homeName){
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn  === detailsName){
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (rn === settingsName){
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    return<Ionicons name={iconName} size={size} color={color}/>
                },

                headerShown: false,
            })}>

            <Tab.Screen name={homeName} component={HomeScreen}/>
            <Tab.Screen name={detailsName} component={DetailsScreen}/>
            <Tab.Screen name={settingsName} component={SettingsScreen}/>

            </Tab.Navigator>
    )
    
}


export default function MainContainer(){
    const user = false;
    return(
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name='Login' component={LoginScreen}/>
                <Stack.Screen name='MainApp' component={MainApp}/>
                <Stack.Screen name='Chat' component={ChatScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}