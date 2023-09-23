import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Header} from './Header';
import {useTheme} from '../../../ThemeProvider';

export const Home = () => {
  const {theme} = useTheme();

  return (
    <View>
      <Header title="Home" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{marginTop: 200}}>
          <Text style={{color: theme.colors.text}}>Hello</Text>
        </View>
      </ScrollView>
    </View>
  );
};
