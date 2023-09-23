import React from 'react';
import {StyleSheet, Text} from 'react-native';

export const TextContent = ({children}: {children: JSX.Element}) => {
  return <Text style={[styles.text]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
  },
});
