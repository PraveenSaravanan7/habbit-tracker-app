import React from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {TextContent} from './TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {useNavigator} from '../../NavigationUtils';

interface IHeaderProps {
  title: string;
  icon?: JSX.Element;
}

export const Header = ({title, icon}: IHeaderProps) => {
  const {theme} = useTheme();
  const {goBack} = useNavigator();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.background,
          paddingTop: StatusBar.currentHeight,
          borderBottomColor: theme.colors.surface[100],
        },
      ]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
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
        </View>
        {icon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    borderBottomWidth: 1,
  },
  container: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    columnGap: 8,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
