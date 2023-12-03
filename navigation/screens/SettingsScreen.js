import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { auth } from '../../firebase'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


import { getLocalUserData } from '../../backend/UserDBService';
import Header from '../components/Header';

const ProfileScreen = ({navigation}) => {

    const localUser = getLocalUserData();
    // console.log(localUser)

    const handleSignOut = () => {
      auth.signOut()
      .then(() => {
          navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings"/>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image 
            source={localUser.pfp ? {uri: localUser.pfp} : null}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{localUser.name}</Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{localUser.address}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{localUser.email}</Text>
        </View>
      </View>

      <View style={styles.seperator}>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="heart-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Gym buddies</Text>
          </View>
        </TouchableRipple>
        
        <TouchableRipple onPress={() => {navigation.navigate('Edit Profile')}}>
          <View style={styles.menuItem}>
            <Icon name="account-edit-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Edit profile</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={handleSignOut}>
          <View style={styles.menuItem}>
            <Icon name="logout" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Sign Out</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  seperator: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});