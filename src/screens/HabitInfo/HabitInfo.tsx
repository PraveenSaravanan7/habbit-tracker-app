import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';
import {CategoryIcon} from '../components/CategoryIcon';
import {Calendar} from '../../components/Calendar';
import {useTheme} from '../../../ThemeProvider';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {DAY_COLOR, getDayColorAndIsDisabled} from '../../utils';
import {THabit} from '../../database/models/habit';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import {commonColors} from '../../../themes';

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

  const updateHistory = useCallback(
    () =>
      setHistory(() => JSON.parse(JSON.stringify(getHistoryModel().find()))),
    [],
  );

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
          <CalendarTab
            history={history}
            habit={habit}
            updateHistory={updateHistory}
          />
        )}
      </View>
    </View>
  );
};

const CalendarTab = ({
  history,
  habit,
  updateHistory,
}: {
  habit: THabit;
  history: IHistory[];
  updateHistory: () => void;
}) => {
  const {theme} = useTheme();
  const {UpdateUi, updateProgress, historyUpdated} = useHabitUpdate();

  const colorMap: Record<DAY_COLOR, string[]> = {
    [DAY_COLOR.COMPLETED]: [commonColors.green],
    [DAY_COLOR.DISABLED]: [theme.colors.surface[200]],
    [DAY_COLOR.IN_COMPLETE]: [commonColors.red],
    [DAY_COLOR.IN_PROGRESS]: [commonColors.orange],
    [DAY_COLOR.NO_PROGRESS]: [theme.colors.surface[500]],
    [DAY_COLOR.NO_PROGRESS_OLD]: [commonColors.orange],
  };

  useEffect(() => {
    updateHistory();
  }, [historyUpdated, updateHistory]);

  return (
    <>
      <ScrollView>
        <Calendar
          updateCurrentDate={day => updateProgress(habit, day)}
          backgroundColor={theme.colors.background}
          getDayColorAndIsDisabled={day =>
            getDayColorAndIsDisabled(day, habit, colorMap, history)
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
