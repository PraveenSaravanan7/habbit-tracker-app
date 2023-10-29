import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';
import {CategoryIcon} from '../components/CategoryIcon';
import {Calendar} from '../../components/Calendar';
import {useTheme} from '../../../ThemeProvider';

export enum HABIT_INFO_TAB {
  CALENDAR = 'Calendar',
  STATS = 'Statistics',
  EDIT = 'Edit',
}

export const HabitInfo = () => {
  const {
    params: {habit, category, tab},
  } = useRouter<'HabitInfo'>();

  const [activeTab, setActiveTab] = useState(tab);

  const updateActiveTab = (selectedTab: string) =>
    setActiveTab(selectedTab as HABIT_INFO_TAB);

  return (
    <View>
      <Header
        title={habit.habitName}
        icon={
          <CategoryIcon
            borderRadius={8}
            size={28}
            iconSize={16}
            category={category}
          />
        }
        tabs={Object.values(HABIT_INFO_TAB)}
        activeTab={activeTab}
        onSelectTab={updateActiveTab}
      />
      <View style={[styles.tabWrapper]}>
        {activeTab === HABIT_INFO_TAB.CALENDAR && <CalendarTab />}
      </View>
    </View>
  );
};

const CalendarTab = () => {
  const {theme} = useTheme();

  return (
    <ScrollView>
      <Calendar
        updateCurrentDate={console.log}
        backgroundColor={theme.colors.background}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    paddingTop: 130,
  },
});
