import React, {useEffect, useState} from 'react';
import {DateRange} from './DateRange';
import {Moment} from 'moment';
import {StyleSheet, View} from 'react-native';
import getHabitModel, {THabit} from '../../database/models/habit';
import getCategoryModel, {ICategory} from '../../database/models/category';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import {TextContent} from '../../components/TextContent';
import {CategoryIcon} from '../components/CategoryIcon';
import {useTheme} from '../../../ThemeProvider';
import {convertHexToRGBA, isDayDisabled} from '../../utils';
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
  const [_, setHistory] = useState<IHistory[]>([]);

  const {theme} = useTheme();
  const {UpdateUi} = useHabitUpdate();

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
    const todayHistory = getHistoryModel().findOne({
      date: currentDate.format('DD/MM/YYYY'),
    });
    const allHabits = getHabitModel().find();
    const completion =
      todayHistory?.habits.reduce((acc, candidate) => {
        acc.set(candidate.habitId, candidate.completed);
        return acc;
      }, new Map<string, boolean>()) || new Map<string, boolean>();

    setHabits(
      [...allHabits]
        .sort((a, b) => {
          if (completion.get(a.id) && !completion.get(b.id)) return 1;
          else if (!completion.get(a.id) && completion.get(b.id)) return -1;

          return b.priority - a.priority;
        })
        .filter(habit => !isDayDisabled(currentDate, habit, true)),
    );

    setHistory(JSON.parse(JSON.stringify(todayHistory)));
  }, [currentDate]);

  // add habit, update history

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

              {/* <View style={{marginLeft: 'auto'}}>
                <TextContent>{habit.habitName}</TextContent>
              </View> */}
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
});
