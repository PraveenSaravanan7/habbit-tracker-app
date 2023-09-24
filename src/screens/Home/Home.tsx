import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Header} from './Header';
import {useTheme} from '../../../ThemeProvider';
import {MAIN_TABS} from './types';
import {Footer} from './Footer';

export const Home = () => {
  const {theme} = useTheme();
  const [activeTab, setActiveTab] = useState(MAIN_TABS.TODAY);

  const updateActiveTab = (screen: MAIN_TABS) => setActiveTab(screen);

  return (
    <View style={[styles.container]}>
      <Header title={activeTab} />
      <Footer activeTab={activeTab} updateActiveTab={updateActiveTab} />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{marginTop: 200}}>
          <Text style={{color: theme.colors.text}}>Hello</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
