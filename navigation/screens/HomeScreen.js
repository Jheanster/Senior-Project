import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  addProspectApprovalToDB,
  addProspectRejectionToDB,
  getLocalUserData,
  getProspectsData,
} from "../../backend/UserDBService";
import { Ionicons, AntDesign, Entypo } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import tw from "twrnc";
import FlipCard from "react-native-flip-card";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { doc, onSnapshot } from "@firebase/firestore"
import { docDB } from "../../firebase";

const ThumbsIcon = ({ bool }) => {
  {
    /* toggle-off, toggle-on, smile-o, frown-o, thumbs-o-up, thumbs-o-down, times-circle-o, check-circle-o */
  }
  return bool ? (
    <FontAwesome name="thumbs-o-up" size={20} style={tw`mr-2`} />
  ) : (
    <FontAwesome name="thumbs-o-down" size={20} style={tw`mr-2`} />
  );
};

const ExperienceLevel = ({ number }) => {
  var level = "Novice";
  if (number > 75) {
    level = "Professional";
  } else if (number > 50) {
    level = "Advanced";
  } else if (number > 25) {
    level = "Intermediate";
  }

  return <Text style={tw`text-lg`}>Experience Level: {level}</Text>;
};

const Card = ({ cardRef }) => {
  const [backSide, setBackSide] = useState(false);

  const handleFlip = () => {
    setBackSide(!backSide);
  };

  return (
    <FlipCard
      style={styles.cardContainer}
      friction={6}
      perspective={1000}
      flipHorizontal={true}
      flipVertical={false}
      flip={backSide}
      clickable={true}
    >
      {/* Front Side */}
      <TouchableOpacity onPress={handleFlip}>
        <View key={cardRef.id} style={tw`relative bg-white h-3/3.4 rounded-xl`}>
          <Image
            style={tw`absolute top-0 h-full w-full rounded-xl`}
            source={cardRef.pfp ? { uri: cardRef.pfp } : null}
          />

          <View
            style={[
              tw`absolute bottom-0 bg-white flex-row justify-between items-center w-full h-20 px-6 py-2 rounded-b-xl`,
              styles.cardShadow,
            ]}
          >
            <View>
              <Text style={tw`text-xl font-bold`}>{cardRef.name}</Text>
              <Text>{cardRef.bio}</Text>
            </View>
            <Text style={tw`text-2xl font-bold`}>{cardRef.age}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Back Side */}
      <TouchableOpacity onPress={handleFlip}>
        <View key={cardRef.id} style={tw`relative bg-white h-3/3.4 rounded-xl`}>
          <View>
            <Text style={tw`text-3xl font-bold text-center mt-4 mb-1`}>
              About {cardRef.name.split(" ")[0]}
            </Text>

            <View style={styles.line} />

            <View style={tw`items-center`}>
              <View style={tw`flex-row mt-1`}>
                <Icon name="city-variant-outline" size={28} style={tw`mr-2`} />
                <Text style={tw`text-xl`}>City: {cardRef.city}</Text>
              </View>
              <View style={tw`flex-row mt-1 mb-1`}>
                <Icon name="flag-outline" size={28} style={tw`mr-2`} />
                <Text style={tw`text-xl`}>State: {cardRef.state}</Text>
              </View>

              <View style={styles.line} />

              <Text style={tw`text-3xl font-bold text-center mt-1`}>
                Training Types
              </Text>
              <View style={tw`flex-row justify-between mt-1`}>
                <View style={tw`flex-row`}>
                  <Text style={tw`text-base ml-4`}>Powerlifting: </Text>
                  <ThumbsIcon bool={cardRef.powerlifting} />
                </View>
                <View style={tw`flex-row mr-2 ml-6.5`}>
                  <Text style={tw`text-base text-left`}>Bodybuilding: </Text>
                  <ThumbsIcon bool={cardRef.bodybuilding} />
                </View>
              </View>
              <View style={tw`flex-row justify-between mt-1`}>
                <View style={tw`flex-row mr-2 ml-8`}>
                  <Text style={tw`text-base`}>CrossFit: </Text>
                  <ThumbsIcon bool={cardRef.crossfit} />
                </View>
                <View style={tw`flex-row`}>
                  <Text style={tw`text-base ml-6.5`}>Calisthenics: </Text>
                  <ThumbsIcon bool={cardRef.calisthenics} />
                </View>
              </View>
              <View style={tw`flex-row justify-between mt-1`}>
                <View style={tw`flex-row`}>
                  <Text style={tw`text-base ml-11`}>Running: </Text>
                  <ThumbsIcon bool={cardRef.running} />
                </View>
                <View style={tw`flex-row mr-3 ml-2`}>
                  <Text style={tw`text-base`}>General Fitness: </Text>
                  <ThumbsIcon bool={cardRef["general-fitness"]} />
                </View>
              </View>
              <View style={tw`flex-row justify-between mt-1`}>
                <View style={tw`flex-row ml-9.5`}>
                  <Text style={tw`text-base`}>Cycling: </Text>
                  <ThumbsIcon bool={cardRef.cycling} />
                </View>
                <View style={tw`flex-row ml-7.5 mb-1`}>
                  <Text style={tw`text-base`}>Weight Loss: </Text>
                  <ThumbsIcon bool={cardRef["weight-loss"]} />
                </View>
              </View>
            </View>

            <View style={styles.line} />

            <View style={tw`items-center mt-1`}>
              <View style={tw`mt-1 flex-row`}>
                <Icon name="weight-lifter" size={28}></Icon>
                <ExperienceLevel number={cardRef.experience} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </FlipCard>
  );
};

/*
    TODO:
    -reload prospects after settings are changes
    -add distance away from you to prospect cards
    -finish edit profile and create profile screens
    -clean up code and add comments
    -maybe: add button to reset all swipes and matches
*/

function HomeScreen() {
  const navigation = useNavigation();
  const localUser = getLocalUserData();
  const [profiles, setProfiles] = useState([]);
  const swiperRef = useRef(null);
  // console.log(localUser)
  // console.log(localUser.pfp)

  useEffect(() => setProfiles(getProspectsData()), [localUser]);

  useLayoutEffect(() => {
    const userDocRef = doc(docDB, 'users', localUser.id);
  
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      // console.log("Snapshot Data: ", snapshot.data());
  
      if (snapshot.exists()) {
        const userData = snapshot.data();
  
        if (Object.keys(userData).length === 1 && userData.hasOwnProperty('email')) {
          // If the user has only an email field, navigate to 'Modal'
          navigation.navigate('Edit', {screen: 'Edit Profile'});
        }
      }
    });
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [localUser, navigation]);

  const handleSwipeLeft = (cardIndex) => {
    const userSwiped = profiles[cardIndex];
    if (userSwiped) {
      console.log(`You rejected ${userSwiped.name}`);
      addProspectRejectionToDB(userSwiped);
    }
  };

  const handleSwipeRight = (cardIndex) => {
    const userSwiped = profiles[cardIndex];
    if (userSwiped) {
      console.log(`You approved ${userSwiped.name}`);

      addProspectApprovalToDB(userSwiped, () => {
        navigation.navigate("Match", { localUser, userSwiped });
      });
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      {/* Header */}
      <View style={tw`items-center relative`}>
        <TouchableOpacity
          style={tw`absolute left-5 top-3`}
          onPress={() => navigation.navigate("Edit")}
        >
          <Image
            source={localUser.pfp ? { uri: localUser.pfp } : null}
            style={tw`h-10 w-10 rounded-full`}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw`h-14 w-14`}
            source={require("../../assets/images/dumbbell.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`absolute right-5 top-3`}
          onPress={() => navigation.navigate("Chat")}
        >
          <Ionicons name="chatbubbles-sharp" size={30} />
        </TouchableOpacity>
      </View>
      {/* End of Header */}

      {/* Cards */}
      <View style={tw`flex-1 -mt-6`}>
        <Swiper
          ref={swiperRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={handleSwipeLeft}
          onSwipedRight={handleSwipeRight}
          backgroundColor="#4FD0E9"
          overlayLabels={{
            left: {
              title: "Not Today",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "Lets get it",
              style: {
                label: {
                  textAlign: "left",
                  color: "#4DED30",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <Card cardRef={card} />
            ) : (
              <View
                style={[
                  tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                  styles.cardShadow,
                ]}
              >
                <Text style={tw`font-bold pb-5`}>No more profiles</Text>
              </View>
            )
          }
        />
      </View>

      <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <Entypo name="cross" size={24} color={"red"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
          onPress={() => swiperRef.current.swipeRight()}
        >
          <AntDesign name="heart" size={24} color={"green"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

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

  line: {
    height: 4,
    width: "100%",
    backgroundColor: "black",
    marginBottom: 1,
  },
});
