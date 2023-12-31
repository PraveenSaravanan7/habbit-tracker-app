import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from './Header';
import {MAIN_TABS} from './types';
import {Footer} from './Footer';
import moment, {Moment} from 'moment';
import {Today} from './Today';
import {Category} from './Category';
import {Habit} from './Habit';
import {Timer} from './Timer';

export const Home = () => {
  const [activeTab, setActiveTab] = useState(MAIN_TABS.TODAY);
  const [currentDate, setCurrentDate] = useState(moment().startOf('day'));

  const updateCurrentDate = (date: Moment) => setCurrentDate(date);

  const updateActiveTab = (screen: MAIN_TABS) => setActiveTab(screen);

  return (
    <View style={[styles.container]}>
      <Header
        activeTab={activeTab}
        currentDate={currentDate}
        updateCurrentDate={updateCurrentDate}
      />
      <Footer activeTab={activeTab} updateActiveTab={updateActiveTab} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.screenWrapper}>
          {activeTab === MAIN_TABS.TODAY && (
            <Today
              currentDate={currentDate}
              updateCurrentDate={updateCurrentDate}
            />
          )}
          {activeTab === MAIN_TABS.CATEGORY && <Category />}
          {activeTab === MAIN_TABS.HABIT && <Habit tasksMode={false} />}
          {activeTab === MAIN_TABS.TASK && <Habit tasksMode={true} />}
          {activeTab === MAIN_TABS.TIMER && <Timer />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {marginTop: 100, marginBottom: 200},
});
