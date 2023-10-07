import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Card from '../components/SpotMeCard'
import users from '../users'

function HomeScreen() {

    return (

        // View for the first page
        <View style={styles.container}>

            {/* Each card is a different profile. The general card layout can be changed in navigation/components/SpotMeCard/index.js*/}
            <Card user={users[0]}/>
        </View>
       
    )
}



const styles = StyleSheet.create({

    // This changes the whole page
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})

export default HomeScreen