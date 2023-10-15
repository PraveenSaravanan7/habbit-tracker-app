import React from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {TextContent} from './TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {useNavigator} from '../../NavigationUtils';

export const Header = ({title}: {title: string}) => {
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
          color={theme.colors.text}
          name="arrow-left"
          size={28}
        />
      </Pressable>
      <TextContent style={[styles.title, {color: theme.colors.text}]}>
        {title}
      </TextContent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 16,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
  },
});
