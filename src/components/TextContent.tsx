import React from 'react';
import {StyleSheet, Text, TextProps} from 'react-native';
import {useTheme} from '../../ThemeProvider';

interface ITextContent {
  children: JSX.Element;
  numberOfLines?: number;
  ellipsizeMode?: TextProps['ellipsizeMode'];
}

export const TextContent = ({
  numberOfLines,
  ellipsizeMode,
  children,
}: ITextContent) => {
  const {theme} = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[styles.text, {color: theme.colors.text}]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
  },
});
