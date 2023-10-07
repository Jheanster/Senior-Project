import React from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from 'react-native'


const Card = ( props ) => {
    const {name, image, bio } = props.user;
    return (
        <View style={styles.card}>
        <ImageBackground
            source={{
            uri: image,
            }}
            style={styles.image}
        >
            <View style={styles.cardInner}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.bio}>
                    {bio}
                </Text>
            </View>
        </ImageBackground>
    </View>
    )
}

export default Card;


const styles = StyleSheet.create({

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'flex-end',
  
    },

    // Changes how the profile will look on screen
    card: {
        width: '95%',
        height: '95%',
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
        backgroundColor: 'red',
    },

    name:{
        fontSize: 30,
        color:'black',
        fontWeight:'bold',
    },

    bio: {
        fontSize: 15,
        lineHeight: 25,
        color:'black',
    },

  
})