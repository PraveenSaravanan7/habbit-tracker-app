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
import {
  DAY_COLOR,
  convertHexToRGBA,
  getDayColor,
  isDayDisabled,
} from '../../utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {commonColors} from '../../../themes';

export interface ITodayProps {
  currentDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}

export const Today = ({currentDate, updateCurrentDate}: ITodayProps) => {
  const {theme} = useTheme();
  const {UpdateUi, updateProgress, historyUpdated} = useHabitUpdate();

  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories, setCategories] = useState<Map<string, ICategory>>(
    new Map(),
  );
  const [history, setHistory] = useState<Map<string, IHistory['habits'][0]>>(
    new Map(),
  );

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
        .filter(habit => !isDayDisabled(currentDate, habit, true))
        .sort((a, b) => {
          const aHistory = completion.get(a.id);
          const bHistory = completion.get(b.id);

          if (!aHistory && bHistory) return -1; // a comes before b

          if (aHistory && !bHistory) return 1; // b comes before a

          return b.priority - a.priority;
        }),
    );

    setHistory(completion);
  }, [currentDate, historyUpdated]);

  // add habit, update history

  // eslint-disable-next-line react/no-unstable-nested-components
  const ProgressButton = ({habit}: {habit: THabit}) => {
    const progress = history.get(habit.id);

    const colorMap: Record<DAY_COLOR, string[]> = {
      [DAY_COLOR.COMPLETED]: [
        convertHexToRGBA(commonColors.green, 0.2),
        commonColors.green,
      ],
      [DAY_COLOR.DISABLED]: [
        theme.colors.surface[200],
        theme.colors.surface[400],
      ],
      [DAY_COLOR.IN_COMPLETE]: [
        convertHexToRGBA(commonColors.red, 0.2),
        commonColors.red,
      ],
      [DAY_COLOR.IN_PROGRESS]: [
        convertHexToRGBA(commonColors.orange, 0.2),
        commonColors.orange,
      ],
      [DAY_COLOR.NO_PROGRESS]: [theme.colors.surface[200]],
      [DAY_COLOR.NO_PROGRESS_OLD]: [theme.colors.surface[200]],
    };

    const color = getDayColor(currentDate, false, colorMap, progress);

    if (currentDate.isAfter(moment().startOf('day')))
      return (
        <View style={[styles.progressButton, {backgroundColor: color[0]}]}>
          <MaterialCommunityIcons
            color={color[1]}
            size={24}
            name="lock-outline"
          />
        </View>
      );

    return (
      <View style={[styles.progressButton, {backgroundColor: color[0]}]}>
        {progress && (
          <MaterialCommunityIcons
            color={color[1]}
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
      </View>
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
            <Pressable
              key={habit.id}
              onPress={() => updateProgress(habit, currentDate)}
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
            </Pressable>
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
