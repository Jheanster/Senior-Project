import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Pressable, StyleSheet, View, Text, useWindowDimensions} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, useDerivedValue, interpolate } from 'react-native-reanimated'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler'
import Card from '../components/SpotMeCard'
import users from '../users'
import { getProspects } from '../../backend/UserDBService'


const ROTATION = 60;
const SWIPE_THRESHOLD = 1500;

function HomeScreen() {

    // Set the current user in the stack of cards
    const [currentIndex,setCurrentIndex] = useState(0);
    const currentProfile = getProspects()[currentIndex]

    const[nextIndex, setNextIndex] = useState(currentIndex + 1);
    const nextProfile = users[nextIndex];


    const { width: screenWidth } = useWindowDimensions();
    const hiddenTranslateX = 2 * screenWidth;


    const translateX = useSharedValue(0);         // Translation values (from left, middle, right): -width 0 width
    const rotate = useDerivedValue(() => interpolate(translateX.value, [0,hiddenTranslateX], [0,ROTATION]) + 'deg'); // Rotation values (from left, middle, right): -60deg 0 60deg 

    // The current cards animation settings
    const cardStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
            {
                rotate: rotate.value,
            }
    ],

    }));

    const nextCardStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scale: interpolate(
                    translateX.value, 
                    [-hiddenTranslateX,0,hiddenTranslateX],
                    // Values that change: Full scale if swipe left or right, scaled to .8 if no swipe
                    [1,0.8,1]),
            },
        ],
        opacity: interpolate(
            translateX.value, 
            [-hiddenTranslateX,0,hiddenTranslateX],
            // Values that change: Full scale if swipe left or right, scaled to .8 if no swipe
            [1,0.5,1]),

        

    }));

    const gestureHandler = useAnimatedGestureHandler({
        onStart:(_,context) => {
            context.startX = translateX.value;
        },

        onActive: (event,context) => {
            translateX.value = context.startX + event.translationX;
            // console.log('Touch x: ', event.translationX);
        },

        onEnd: (event) => {
            // console.log('Touch ended');
            if (Math.abs(event.velocityX) < SWIPE_THRESHOLD ) { 
                translateX.value = withSpring(0);
                return;
            } 

        }
    });

    return (
        // View for the first page
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.nextCardContainer}>
                <Animated.View style={[styles.animatedCard,nextCardStyle]}>
                    <Card user={nextProfile}/>
                </Animated.View>
            </View>
           
        
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.animatedCard,cardStyle]}>
                    {/* Each card is a different profile. The general card layout can be changed in navigation/components/SpotMeCard/index.js*/}
                    <Card user={currentProfile}/>
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
        flex: 1,
    },

    nextCardContainer:{
        ...StyleSheet.absoluteFillObject,
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
    
    },
})

export default HomeScreen