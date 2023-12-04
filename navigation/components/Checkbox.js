import React, {useRef} from 'react';
import {TouchableOpacity, Text, View, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Checkbox = ({
  text,
  onPress,
  isChecked,
  textStyle,
  checkboxStyle,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    const toValue = isChecked ? 0 : 30;
    Animated.timing(animatedWidth, {
      toValue: toValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        onPress={() => {
          startAnimation();
          onPress();
        }}
        style={[
          styles.checkbox,
          isChecked && styles.checkboxSelected,
          checkboxStyle,
        ]}>
        <Animated.View style={{width: animatedWidth, marginTop: -2}}>
          <Icon name="checkmark" size={30} style={{color: 'white'}} />
        </Animated.View>
      </TouchableOpacity>
      <Text style={[styles.checkboxText, textStyle]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
    width: 30,
    marginBottom: 10,
    
  },
  checkboxSelected: {
    backgroundColor: 'black',
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Checkbox;