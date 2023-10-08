import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Pressable, StyleSheet, View, Text} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler } from 'react-native-reanimated'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'
import Card from '../components/SpotMeCard'
import users from '../users'

function HomeScreen() {

    const translateX = useSharedValue(0);
    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
            {
                rotate: '0deg',
            }
    ],

    }));

    const gestureHandler = useAnimatedGestureHandler({
        onStart:(_,context) => {
            context.startX = translateX.value;
        },

        onActive: (event,context) => {
            translateX.value = context.startX + event.translationX;
            console.log('Touch x: ', event.translationX);
        },

        onEnd: () => {
            console.log('Touch ended');
        }
    });

    return (
        // View for the first page
        <GestureHandlerRootView style={styles.container}>
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.animatedCard,cardStyle]}>
                    {/* Each card is a different profile. The general card layout can be changed in navigation/components/SpotMeCard/index.js*/}
                    <Card user={users[2]}/>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
       
    )
}

const styles = StyleSheet.create({

    // This changes the whole page
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    animatedCard:{
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default HomeScreen