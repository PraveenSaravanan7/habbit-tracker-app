import React from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import {MAIN_TABS} from './types';
import moment, {Moment} from 'moment';

interface IHeaderProps {
  activeTab: MAIN_TABS;
  currentDate: Moment;
}

export const Header = ({activeTab, currentDate}: IHeaderProps) => {
  const {theme} = useTheme();

  const title = (() => {
    if (activeTab !== MAIN_TABS.TODAY) return activeTab;

    if (currentDate.isSame(moment().startOf('day'))) return 'Today';

    return currentDate.format('MMM Do, YYYY');
  })();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingTop: styles.container.padding + (StatusBar.currentHeight || 0),
        },
      ]}>
      <View>
        <TextContent>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            {title}
          </Text>
        </TextContent>
      </View>
      <View style={[styles.iconContainer]}>
        <Pressable>
          <MaterialIcons name={'search'} color={theme.colors.text} size={28} />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons
            name="calendar"
            color={theme.colors.text}
            size={28}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontFamily: 'Inter-Black',
    lineHeight: 26,
  },
  iconContainer: {marginLeft: 'auto', flexDirection: 'row', columnGap: 20},
});
