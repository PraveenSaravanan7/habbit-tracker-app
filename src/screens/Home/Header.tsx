import React from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';

interface IHeaderProps {
  title: string;
}

export const Header = ({title}: IHeaderProps) => {
  const {theme} = useTheme();

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
          <MaterialCommunityIcons
            name="calendar"
            color={theme.colors.text}
            size={28}
          />
        </Pressable>
        <Pressable>
          <MaterialCommunityIcons
            name={'help-circle-outline'}
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
