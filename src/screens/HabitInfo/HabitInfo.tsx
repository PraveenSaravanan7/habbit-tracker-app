import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';
import {CategoryIcon} from '../components/CategoryIcon';
import {Calendar} from '../../components/Calendar';
import {useTheme} from '../../../ThemeProvider';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {getDayColorAndIsDisabled} from '../../utils';
import {HISTORY_MODEL_EVENT, THabit} from '../../database/models/habit';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import database from '../../database/database';

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
  // TODO: fetch only history of the month
  const [history, setHistory] = useState<IHistory[]>(() =>
    JSON.parse(JSON.stringify(getHistoryModel().find())),
  );

  const updateActiveTab = (selectedTab: string) =>
    setActiveTab(selectedTab as HABIT_INFO_TAB);

  useEffect(() => {
    const updateHistory = () =>
      setHistory(() => JSON.parse(JSON.stringify(getHistoryModel().find())));

    database.addListener(HISTORY_MODEL_EVENT.UPDATE_HISTORY, updateHistory);

    return () =>
      database.removeListener(
        HISTORY_MODEL_EVENT.UPDATE_HISTORY,
        updateHistory,
      );
  }, []);

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
        {activeTab === HABIT_INFO_TAB.CALENDAR && (
          <CalendarTab history={history} habit={habit} />
        )}
      </View>
    </View>
  );
};

const CalendarTab = ({
  history,
  habit,
}: {
  habit: THabit;
  history: IHistory[];
}) => {
  const {theme} = useTheme();
  const {UpdateUi, updateProgress} = useHabitUpdate();

  return (
    <>
      <ScrollView>
        <Calendar
          updateCurrentDate={day => updateProgress(habit, day)}
          backgroundColor={theme.colors.background}
          getDayColorAndIsDisabled={day =>
            getDayColorAndIsDisabled(day, habit, theme, history)
          }
        />
      </ScrollView>
      <UpdateUi />
    </>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    paddingTop: 130,
  },
});
