import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useTheme} from '../../ThemeProvider';
import {TextContent} from './TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface IButtonProps {
  onPress: () => void;
  title: string;
  backgroundColor?: string;
  textColor?: string;
  icon?: string;
}

export const Button = ({
  onPress,
  title,
  backgroundColor,
  textColor,
  icon,
}: IButtonProps) => {
  const {theme} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {backgroundColor: backgroundColor || theme.colors.surface[100]},
      ]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={textColor || theme.colors.text}
        />
      )}
      <TextContent fontSize={14} fontFamily="Inter-Bold" color={textColor}>
        {title}
      </TextContent>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: 'row',
    columnGap: 8,
  },
});
