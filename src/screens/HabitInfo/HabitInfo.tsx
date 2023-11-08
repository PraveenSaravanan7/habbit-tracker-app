import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';
import {CategoryIcon} from '../components/CategoryIcon';
import {Calendar} from '../../components/Calendar';
import {useTheme} from '../../../ThemeProvider';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {DAY_COLOR, getDayColorAndIsDisabled} from '../../utils';
import getHabitModel, {THabit} from '../../database/models/habit';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import {commonColors} from '../../../themes';
import {TextContent} from '../../components/TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInputModal} from '../components/TextInputModal';
import {HABIT_MODEL_EVENT, emitDatabaseEvent} from '../../database/database';
import {NumberInputModal} from '../components/NumberInputModal';

export enum HABIT_INFO_TAB {
  CALENDAR = 'Calendar',
  STATS = 'Statistics',
  EDIT = 'Edit',
}

export const HabitInfo = () => {
  const {
    params: {habit: habitParam, category, tab},
  } = useRouter<'HabitInfo'>();

  const [habit, setHabit] = useState(habitParam);
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

  const updateHabit = (updatedHabit: THabit) => setHabit({...updatedHabit});

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
        {activeTab === HABIT_INFO_TAB.EDIT && (
          <EditHabit habit={habit} updateHabit={updateHabit} />
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

const EditHabit = ({
  habit,
  updateHabit,
}: {
  habit: THabit;
  updateHabit: (habit: THabit) => void;
}) => {
  const {theme} = useTheme();

  const [editItemType, setEditItemType] = useState<
    'NAME' | 'DESCRIPTION' | 'PRIORITY'
  >();

  const saveUpdatedHabit = (updatedHabit: THabit) => {
    getHabitModel().update(updatedHabit);
    updateHabit(updatedHabit);
    emitDatabaseEvent(HABIT_MODEL_EVENT.UPDATE_HABIT);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({
    name,
    iconName,
    onPress,
    borderTop = 0,
    rightIcon,
  }: {
    name: string;
    iconName: string;
    onPress: () => void;
    borderTop?: number;
    rightIcon?: JSX.Element;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuItem,
        {
          borderTopWidth: borderTop,
          borderTopColor: theme.colors.surface[200],
        },
      ]}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color={theme.colors.primary[100]}
      />
      <TextContent style={styles.menuItemText}>{name}</TextContent>

      <View style={styles.menuRightIcon}>{rightIcon}</View>
    </Pressable>
  );

  return (
    <View>
      <Item
        iconName="pencil-outline"
        name="Habit name"
        onPress={() => setEditItemType('NAME')}
        rightIcon={
          <TextContent
            numberOfLines={1}
            ellipsizeMode="tail"
            maxScreenWidth={0.3}
            fontFamily="Inter-Medium"
            fontSize={14}
            color={theme.colors.disabledText}>
            {habit.habitName}
          </TextContent>
        }
      />
      <Item
        borderTop={1}
        iconName="information-outline"
        name="Description"
        onPress={() => setEditItemType('DESCRIPTION')}
        rightIcon={
          <TextContent
            numberOfLines={1}
            ellipsizeMode="tail"
            maxScreenWidth={0.3}
            fontFamily="Inter-Medium"
            fontSize={14}
            color={theme.colors.disabledText}>
            {habit.habitDescription}
          </TextContent>
        }
      />
      <Item
        borderTop={1}
        iconName="flag-outline"
        name="Priority"
        onPress={() => setEditItemType('PRIORITY')}
        rightIcon={
          <TextContent
            numberOfLines={1}
            ellipsizeMode="tail"
            maxScreenWidth={0.3}
            fontFamily="Inter-Medium"
            fontSize={14}
            color={theme.colors.disabledText}>
            {habit.priority === 1 ? 'Default' : habit.priority}
          </TextContent>
        }
      />

      {(editItemType === 'NAME' || editItemType === 'DESCRIPTION') && (
        <TextInputModal
          isOpen={true}
          label={editItemType === 'NAME' ? 'Habit name' : 'Description'}
          updateText={value => {
            if (editItemType === 'NAME') habit.habitName = value;
            if (editItemType === 'DESCRIPTION') habit.habitDescription = value;
            saveUpdatedHabit(habit);
          }}
          updateVisibility={visibility => {
            if (!visibility) setEditItemType(undefined);
          }}
          defaultValue={
            editItemType === 'NAME' ? habit.habitName : habit.habitDescription
          }
        />
      )}

      {editItemType === 'PRIORITY' && (
        <NumberInputModal
          isOpen={true}
          title={'Priority'}
          updateNumber={value => {
            habit.priority = value;
            saveUpdatedHabit(habit);
          }}
          updateVisibility={visibility => {
            if (!visibility) setEditItemType(undefined);
          }}
          defaultValue={habit.priority}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabWrapper: {
    paddingTop: 130,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
  },
  menuRightIcon: {
    marginLeft: 'auto',
  },
});
