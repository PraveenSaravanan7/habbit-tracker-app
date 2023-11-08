import React from 'react';
import {Dimensions, StyleSheet, Text, TextProps} from 'react-native';
import {useTheme} from '../../ThemeProvider';

interface ITextContentProps extends TextProps {
  maxScreenWidth?: number;
  fontFamily?: 'Inter-Medium' | 'Inter-SemiBold' | 'Inter-Bold';
  fontSize?: number;
  color?: string;
}

export const TextContent = ({
  color,
  fontSize,
  fontFamily,
  maxScreenWidth,
  children,
  style,
  ...restProps
}: ITextContentProps) => {
  const {theme} = useTheme();

  const maxWidth =
    maxScreenWidth !== undefined
      ? Dimensions.get('screen').width * maxScreenWidth
      : undefined;

  return (
    <Text
      {...restProps}
      style={[
        styles.text,
        {color: theme.colors.text},
        {maxWidth, fontFamily, fontSize, color},
        style,
      ]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Inter-Regular',
  },
});
