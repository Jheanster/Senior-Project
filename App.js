
import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import MainContainer from './navigation/MainContainer';

// Screen names
const homeName = 'Home';
const detailsName = 'Details';
const settingsName = 'Settings';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




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
