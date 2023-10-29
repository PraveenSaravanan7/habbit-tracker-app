import React from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {TextContent} from './TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {useNavigator} from '../../NavigationUtils';

export const Header = ({title, icon}: {title: string; icon?: JSX.Element}) => {
  const {theme} = useTheme();
  const {goBack} = useNavigator();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface[100],
          paddingTop: styles.container.padding + (StatusBar.currentHeight || 0),
        },
      ]}>
      <Pressable onPress={goBack}>
        <MaterialCommunityIcons
          color={theme.colors.primary[100]}
          name="chevron-left"
          size={24}
        />
      </Pressable>
      <TextContent style={[styles.title, {color: theme.colors.text}]}>
        {title}
      </TextContent>
      {icon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 8,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
