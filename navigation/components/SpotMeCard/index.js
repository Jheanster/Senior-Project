import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native'


const Card = ( props ) => {
    return (
        <View style={styles.card}>
            <ImageBackground
                source={{uri: props.user.pfp}}
                style={styles.pfp}
            >
                <View style={styles.cardInner}>
                    <Text style={styles.name}>{props.user.name}</Text>
                    <Text style={styles.bio}>{props.user.bio}</Text>
                </View>
            </ImageBackground>
            
        </View>
    )
}

export default Card;


const styles = StyleSheet.create({

    pfp: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'flex-end',
  
    },

    // Changes how the profile will look on screen
    card: {
        width: '95%',
        height: '75%',
        borderRadius: 10,

        // Literally search up 'react native shadow generator', gives a slider to change how the shadow looks
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },

    cardInner:{
        padding: 10,
        backgroundColor: 'black',
    },

    name:{
        fontSize: 30,
        color:'white',
        fontWeight:'bold',
    },

    bio: {
        fontSize: 15,
        lineHeight: 25,
        color:'white',
    },

  
})