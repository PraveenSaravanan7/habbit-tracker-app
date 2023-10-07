import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {useTheme} from '../../ThemeProvider';

export const TextContent = ({children, style, ...restProps}: TextProps) => {
  const {theme} = useTheme();
  return (
    <Text
      {...restProps}
      style={[styles.text, {color: theme.colors.text}, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
  },
});
