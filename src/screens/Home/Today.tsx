import React, {useEffect, useState} from 'react';
import {DateRange} from './DateRange';
import moment, {Moment} from 'moment';
import {Pressable, StyleSheet, View} from 'react-native';
import getHabitModel, {HABIT_TYPES, THabit} from '../../database/models/habit';
import getCategoryModel, {ICategory} from '../../database/models/category';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import {TextContent} from '../../components/TextContent';
import {CategoryIcon} from '../components/CategoryIcon';
import {useTheme} from '../../../ThemeProvider';
import {convertHexToRGBA, getDayColor, isDayDisabled} from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ITodayProps {
  currentDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}

export const Today = ({currentDate, updateCurrentDate}: ITodayProps) => {
  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories, setCategories] = useState<Map<string, ICategory>>(
    new Map(),
  );
  const [history, setHistory] = useState<Map<string, IHistory['habits'][0]>>(
    new Map(),
  );

  const {theme} = useTheme();
  const {UpdateUi, updateProgress, historyUpdated} = useHabitUpdate();

  useEffect(() => {
    setCategories(
      getCategoryModel()
        .find()
        .reduce((acc, candidate) => {
          acc.set(candidate.id, candidate);
          return acc;
        }, new Map<string, ICategory>()),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const todayHistory = JSON.parse(
      JSON.stringify(
        getHistoryModel().findOne({
          date: currentDate.format('DD/MM/YYYY'),
        }),
      ),
    ) as IHistory;
    const allHabits = getHabitModel().find();
    const completion =
      todayHistory?.habits.reduce((acc, candidate) => {
        acc.set(candidate.habitId, candidate);
        return acc;
      }, new Map<string, IHistory['habits'][0]>()) ||
      new Map<string, IHistory['habits'][0]>();

    setHabits(
      [...allHabits]
        .sort((a, b) => b.priority - a.priority)
        .filter(habit => !isDayDisabled(currentDate, habit, true)),
    );

    setHistory(completion);
  }, [currentDate, historyUpdated]);

  // add habit, update history

  // eslint-disable-next-line react/no-unstable-nested-components
  const ProgressButton = ({habit}: {habit: THabit}) => {
    const progress = history.get(habit.id);

    const color = getDayColor(currentDate, false, theme, progress);

    if (currentDate.isAfter(moment().startOf('day')))
      return (
        <View
          style={[
            styles.progressButton,
            {backgroundColor: theme.colors.surface[100]},
          ]}>
          <MaterialCommunityIcons color={color} size={24} name="lock-outline" />
        </View>
      );

    return (
      <Pressable
        style={[
          styles.progressButton,
          {backgroundColor: convertHexToRGBA(color, 0.2)},
        ]}
        onPress={() => updateProgress(habit, currentDate)}>
        {/* <TextContent>{color}</TextContent> */}
        {progress && (
          <MaterialCommunityIcons
            color={color}
            size={24}
            name={
              progress.completed
                ? 'check-bold'
                : habit.habitType === HABIT_TYPES.YES_OR_NO
                ? 'close-thick'
                : 'dots-horizontal'
            }
          />
        )}
      </Pressable>
    );
  };

  return (
    <>
      <DateRange
        currentDate={currentDate}
        updateCurrentDate={updateCurrentDate}
      />
      <View style={styles.listWrapper}>
        {habits.map(habit => {
          const category = categories.get(habit.category) as ICategory;

          return (
            <View
              key={habit.id}
              style={[
                styles.item,
                {borderBottomColor: theme.colors.surface[100]},
              ]}>
              <CategoryIcon
                size={36}
                borderRadius={10}
                iconSize={24}
                category={categories.get(habit.category) as ICategory}
              />

              <View style={styles.nameContainer}>
                <TextContent style={styles.habitName}>
                  {habit.habitName}
                </TextContent>
                <View
                  style={[
                    styles.label,
                    {backgroundColor: convertHexToRGBA(category.color, 0.2)},
                  ]}>
                  <TextContent
                    style={[styles.labelText, {color: category.color}]}>
                    Habit
                    {habit.priority > 1 ? (
                      <>
                        {` | ${habit.priority}`}
                        <MaterialCommunityIcons
                          name="flag-outline"
                          color={category.color}
                          size={10}
                        />
                      </>
                    ) : null}
                  </TextContent>
                </View>
              </View>
              <ProgressButton habit={habit} />
            </View>
          );
        })}
      </View>
      <UpdateUi />
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  listWrapper: {
    marginTop: 8,
  },
  text: {},
  label: {
    borderRadius: 4,
    width: 'auto',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  nameContainer: {
    rowGap: 4,
  },
  habitName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  progressButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    borderRadius: 100,
  },
});
