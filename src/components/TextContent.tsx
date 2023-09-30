import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from '../../ThemeProvider';

export const TextContent = ({children}: {children: JSX.Element}) => {
  const {theme} = useTheme();
  return (
    <Text style={[styles.text, {color: theme.colors.text}]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
  },
});
