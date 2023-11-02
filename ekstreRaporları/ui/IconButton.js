/* eslint-disable */
import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {View, TouchableOpacity,Pressable, StyleSheet} from 'react-native';
import {Text} from './Text';
import {IconSizes, MaterialIcon} from './Icon';

MIcon.loadFont();

const IconButton = ({ icon, color, size, onPress, disabled }) => {
    return (
      <View style={styles.buttonView}>
        <Pressable onPress={onPress} disabled={disabled} android_disableSound 
          android_ripple={{ color: '#b9b5bd', borderless: true}}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? '#f2f0f5' : 'white',
            },
            styles.wrapperCustom,
          ]}>
          {/* {({pressed}) => (
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
          )} */}
          
          <MIcon name={icon} color={disabled ? '#b9b5bd' : color} size={IconSizes[size]} />
        </Pressable>
      </View>
    );
  }
  
  export default IconButton;
  
  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
    },
    wrapperCustom: {
      padding: 6,
    },
    buttonView: {
      borderRadius: 24,
      justifyContent: 'center',
      overflow: 'hidden',
      //elevation: 8,
    },
  });