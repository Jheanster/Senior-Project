import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { View, Text, Button, TouchableOpacity, Image, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLocalUserData, getProspectsData } from '../../backend/UserDBService';
import { Ionicons, AntDesign, Entypo} from '@expo/vector-icons';
import { collection, doc, onSnapshot, setDoc, query, where, getDocs, getDoc, serverTimestamp } from "@firebase/firestore"
import Swiper from "react-native-deck-swiper"
import tw from 'twrnc';
import { docDB } from '../../firebase';
import generateId from '../../lib/generateId';

function HomeScreen() {
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState(getProspectsData());
    const localUser = getLocalUserData();

    // console.log(localUser);
    const swiperRef = useRef(null);
    
    const handleSwipeLeft = (cardIndex) => {
        if(!profiles[cardIndex]) return;

        // This adds a new called passes collection for the user that keeps track of the passes made on that account
        const userSwiped = profiles[cardIndex];
        console.log(`You swiped pass on ${userSwiped.name}`)
        setDoc(doc(docDB, 'users', localUser.id, 'passes', userSwiped.id), userSwiped);
    }

    const handleSwipeRight = (cardIndex) => {
        if(!profiles[cardIndex]) return;

        // This adds a new collection called matches that keeps track of the matches made on that account
        const userSwiped = profiles[cardIndex];

        // Check if the profile matched with you
        getDoc(doc(docDB,'users',userSwiped.id,'matches',localUser.id)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()){
                    // User has matched with you before you matched with them
                    // Create a match
                    console.log(`Congrats, you have matched with ${userSwiped.name}`)
                    setDoc(doc(docDB, 'users', localUser.id, 'matches', userSwiped.id), userSwiped);

                    // Create a match

                    setDoc(doc(docDB,'matches',generateId(localUser.id,userSwiped.id)), {
                        users: {
                            [localUser.id]: localUser,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [localUser.id,userSwiped.id],
                        timestamp: serverTimestamp(),
                    });
                    navigation.navigate('Match', {
                        localUser,
                        userSwiped,
                    });
                } else {
                    // Local user swiped match first
                    console.log(`You swiped match on ${userSwiped.name}`)
                    // This adds a new called passes collection for the user that keeps track of the matches made on that account
                    setDoc(doc(docDB, 'users', localUser.id, 'matches', userSwiped.id), userSwiped);
                }
            })
    }

    useEffect(() => {
        let unsub;
        const fetchCards = async () => {

            // Get the ids of all the profiles that a user has passed on
            const passes = await getDocs(collection(docDB,'users',localUser.id,'passes'))
                .then(snapshot => snapshot.docs.map(doc => doc.id));

            const matches = await getDocs(collection(docDB,'users',localUser.id,'matches'))
                .then(snapshot => snapshot.docs.map(doc => doc.id));

            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const matchedUserIds = matches.length > 0 ? matches : ['test'];

            // console.log(passedUserIds)
            // console.log(matchedUserIds)
            unsub = onSnapshot(

                // Show the users you haven't matched or passed already, but when I get rid of the query it works fine
                // query(
                    collection(docDB,'users'),
                //     where('id', 'not-in', [...passedUserIds, ...matchedUserIds]),
                // ),  
                (snapshot) => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== localUser.id).map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
            })
        }

        fetchCards();
        return unsub
    }, [docDB])

    return (
    <SafeAreaView style={tw`flex-1`}>
        {/* Header */}
            <View style={tw`items-center relative`}>
                <TouchableOpacity style={tw`absolute left-5 top-3`} onPress={() => navigation.navigate("Edit")}>
                    <Image source={{uri: localUser.pfp}} style={tw`h-12 w-12 rounded-full`} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Image style={tw`h-14 w-14`} source={require("../../assets/images/dumbbell.png")}/>
                </TouchableOpacity>

                <TouchableOpacity style={tw`absolute right-5 top-3`} onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name='chatbubbles-sharp' size={35}/>
                </TouchableOpacity>
            </View>
        {/* End of Header */}

        {/* Cards */}
        <View style={tw`flex-1 -mt-6`}>
            <Swiper
            ref={swiperRef}
            containerStyle={{backgroundColor:'transparent'}}
                cards={profiles}
                stackSize={5}
                cardIndex={0}
                animateCardOpacity
                verticalSwipe={false}
                onSwipedLeft={(cardIndex) => {
                    console.log("Denied")
                    handleSwipeLeft(cardIndex)
                }}
                onSwipedRight={(cardIndex) => {
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
