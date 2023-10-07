import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './navigation/screens/LoginScreen'
import HomeScreen from './navigation/screens/HomeScreen';
import DetailsScreen from './navigation/screens/DetailsScreen';
import SettingsScreen from './navigation/screens/SettingsScreen';
import MainContainer from './navigation/MainContainer';

// Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MainApp () {
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName){
                iconName = focused ? 'home' : 'home-outline';
            } else if (rn  === detailsName){
                iconName === focused ? 'list' : 'list-outline';
            } else if (rn === settingsName){
                iconName = focused ? 'settings' : 'settings-outline';
            }

            return<Ionicons name={iconName} size={size} color={color}/>
        },
    })}>

    <Tab.Screen name={homeName} component={HomeScreen}/>
    <Tab.Screen name={detailsName} component={DetailsScreen}/>
    <Tab.Screen name={settingsName} component={SettingsScreen}/>

  </Tab.Navigator>
}

export let isUserLoggedIn = false;

export const setIsUserLoggedIn = (value) => {
  isUserLoggedIn = value;
}


export default function App() {
  const userLoggedIn = isUserLoggedIn;
  
  return (
    <MainContainer/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
