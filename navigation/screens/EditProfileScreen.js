import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const EditProfileScreen = () => {
  return (
    <SafeAreaView>
        
        <View style={styles.container}>
            <Text>This is the Edit Profile Screen</Text>
        </View>
        
    </SafeAreaView>

 
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
    },

    backButton:{
        backgroundColor:'#0782f9',
        width:'40%',
        padding:15,
        borderRadius:10,

        alignItems: 'center',
        marginTop:40,

        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: 20,
        marginLeft: 20,
    },

    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },

    buttonContainer:{
        marginVertical: 20,
        height: 40,
        marginHorizontal: 10,
        backgroundColor: '#5d57ff',
        justifyContent: 'center',
        alignItems: 'center'
    },
})