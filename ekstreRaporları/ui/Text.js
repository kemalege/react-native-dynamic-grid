/* eslint-disable */

import React from 'react';
import {
  Text as ReactText,
  StyleSheet,
  TextStyle
} from 'react-native';

export const Text = ({style, children}) => {
  return <ReactText style={[styles.font, style]}>{children}</ReactText>;
};

const styles = StyleSheet.create({
  font: {
    fontFamily: 'Nunito-Regular',
  },
});
