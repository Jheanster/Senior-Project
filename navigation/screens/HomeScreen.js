import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/core'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocalUserData, getProspectsData } from '../../backend/UserDBService';
import { Ionicons, AntDesign, Entypo} from '@expo/vector-icons';
import { collection, doc, onSnapshot, setDoc } from "@firebase/firestore"
import Swiper from "react-native-deck-swiper"
import tw from 'twrnc';
import { docDB } from '../../firebase';

function HomeScreen() {
    const navigation = useNavigation();
    const localUser = getLocalUserData();
    // console.log(localUser);
    const prospects = getProspectsData(); 
    const swiperRef = useRef(null);
    
    const handleSwipeLeft = async(cardIndex) => {
        if(!prospects[cardIndex]) return;

        const userSwiped = prospects[cardIndex];
        console.log(`You swiped pass on ${userSwiped.name}`)
        setDoc(doc(docDB, 'users', localUser.id, 'passes', userSwiped.id), userSwiped)
    }

    const handleSwipeRight = async(cardIndex) => {

    }

    return (
    <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
            <View style={tw`items-center relative`}>
                <TouchableOpacity style={tw`absolute left-5 top-3`} onPress={() => navigation.navigate("Edit")}>
                    <Image source={{uri: localUser.pfp}} style={tw`h-10 w-10 rounded-full`} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image style={tw`h-14 w-14`} source={require("../../assets/images/dumbbell.png")}/>
                </TouchableOpacity>

                <TouchableOpacity style={tw`absolute right-5 top-3`} onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name='chatbubbles-sharp' size={30}/>
                </TouchableOpacity>
            </View>
        {/* End of Header */}

        {/* Cards */}
        <View style={tw`flex-1 -mt-6`}>
            <Swiper
            ref={swiperRef}
            containerStyle={{backgroundColor:'transparent'}}
                cards={prospects}
                stackSize={5}
                cardIndex={0}
                animateCardOpacity
                verticalSwipe={false}
                onSwipedLeft={() => {
                    console.log("Denied")
                    handleSwipeLeft(cardIndex)
                }}
                onSwipedRight={() => {
                    console.log("Accepted")
                    handleSwipeRight(cardIndex)
                }}
                backgroundColor='#4FD0E9'
                overlayLabels={{
                    left: {
                        title: "Not Today",
                        style: {
                            label: {
                                textAlign: 'right',
                                color: 'red',
                            }
                        }
                    },
                    right: {
                        title: "Lets get it",
                        style: {
                            label: {
                                textAlign: 'left',
                                color: '#4DED30',
                            }
                        }
                    }
                }}
                renderCard={card => card ? (
                    <View key={card.id} style={tw`relative bg-white h-3/4 rounded-xl`}>
                        <Image 
                            style={tw`absolute top-0 h-full w-full rounded-xl`} 
                            source={{uri: card.pfp}}
                        />

                        <View style={[tw`absolute bottom-0 bg-white flex-row justify-between items-center w-full h-20 px-6 py-2 rounded-b-xl`,styles.cardShadow]}>
                            <View>
                                <Text style={tw`text-xl font-bold`}>{card.name}</Text>
                                <Text>{card.bio}</Text>
                            </View>
                            <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                        </View>

                    </View>
                ) : (
                    <View style={[tw`relative bg-white h-3/4 rounded-xl justify-center items-center`, styles.cardShadow]}>
                        <Text style={tw`font-bold pb-5`}>
                            No more profiles
                        </Text>
                    </View>
                )}
            />
        </View>
        
        <View style={tw`flex flex-row justify-evenly`}>
            <TouchableOpacity style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
                onPress={() => swiperRef.current.swipeLeft()}
            >
                <Entypo name='cross' size={24} color={'red'}/>
            </TouchableOpacity>
            <TouchableOpacity style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`} 
                onPress={() => swiperRef.current.swipeRight()}
            >
                <AntDesign name='heart' size={24} color={'green'}/>
            </TouchableOpacity>
        </View>

    </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({

    cardShadow: {
        // Literally search up 'react native shadow generator', gives a slider to change how the shadow looks
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 2,
    },
})
