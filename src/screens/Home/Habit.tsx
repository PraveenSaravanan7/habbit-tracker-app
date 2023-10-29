import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import getHabitModel, {
  HABIT_MODEL_EVENT,
  HISTORY_MODEL_EVENT,
  REPEAT_TYPE,
  THabit,
} from '../../database/models/habit';
import {TextContent} from '../../components/TextContent';
import database from '../../database/database';
import {useTheme} from '../../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {convertHexToRGBA} from '../../utils';
import moment, {Moment} from 'moment';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {commonColors} from '../../../themes';
import {useNavigator} from '../../../NavigationUtils';
import {HABIT_INFO_TAB} from '../HabitInfo/HabitInfo';
import {CategoryIcon} from '../components/CategoryIcon';

export const Habit = () => {
  const habitModel = getHabitModel();
  const categoryModel = getCategoryModel();

  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [history, setHistory] = useState<IHistory[]>([]);

  const {theme} = useTheme();
  const {UpdateUi, updateProgress} = useHabitUpdate();

  const getCategory = (habit: THabit) =>
    categories.find(category => category.id === habit.category);

  const getRepeatText = ({repeatConfig}: THabit) => {
    if (repeatConfig.repeatType === REPEAT_TYPE.EVERY_DAY) return 'Every day';

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK)
      return repeatConfig.days.join('-');

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH)
      return 'Days of the month: ' + repeatConfig.days.join(', ');

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
      return repeatConfig.days.join(', ');
  };

  const days = useMemo(() => {
    const list: Moment[] = [];
    let i = -7;

    while (i++) list.push(moment().add(i, 'days'));

    return list;
  }, []);

  const fetchHistory = useCallback(
    (): IHistory[] =>
      JSON.parse(
        JSON.stringify(
          getHistoryModel().find({
            date: {$in: days.map(day => day.format('DD/MM/YYYY'))},
          }),
        ),
      ),
    [days],
  );

  useEffect(() => {
    const updateHabit = () =>
      setHabits(habitModel.find().sort((a, b) => b.priority - a.priority));

    database.addListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);

    return () =>
      database.removeListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);
  }, [habitModel]);

  useEffect(() => {
    setHabits(habitModel.find());
    setCategories(categoryModel.find());
    setHistory(() => fetchHistory());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateHistory = () => setHistory(() => fetchHistory());

    database.addListener(HISTORY_MODEL_EVENT.UPDATE_HISTORY, updateHistory);

    return () =>
      database.removeListener(
        HISTORY_MODEL_EVENT.UPDATE_HISTORY,
        updateHistory,
      );
  }, [fetchHistory]);

  return (
    <>
      <View style={[styles.container]}>
        {habits.map((habit, key) => {
          const category = getCategory(habit);

          if (!category) return null;

          return (
            <View
              style={[
                styles.item,
                {backgroundColor: theme.colors.surface[100]},
              ]}
              key={key}>
              <Title
                habit={habit}
                category={category}
                repeatInfo={getRepeatText(habit) || ''}
              />
              <Days
                habit={habit}
                updateProgress={updateProgress}
                days={days}
                history={history}
              />
              <BottomMenu habit={habit} category={category} />
            </View>
          );
        })}
      </View>
      <UpdateUi />
    </>
  );
};

interface ITitleProps {
  habit: THabit;
  category: ICategory;
  repeatInfo: string;
}

const Title = ({habit, category, repeatInfo}: ITitleProps) => (
  <View style={[styles.itemTop]}>
    <View style={styles.habitNameContainer}>
      <TextContent style={[styles.habitName]}>{habit.habitName}</TextContent>
      <View
        style={[
          styles.label,
          {backgroundColor: convertHexToRGBA(category.color, 0.2)},
        ]}>
        <TextContent style={[styles.labelText, {color: category.color}]}>
          {repeatInfo}
        </TextContent>
      </View>
    </View>

    <CategoryIcon
      category={category}
      size={36}
      borderRadius={12}
      iconSize={22}
    />
  </View>
);

interface IBottomMenuProps {
  habit: THabit;
  category: ICategory;
}

const BottomMenu = ({category, habit}: IBottomMenuProps) => {
  const {theme} = useTheme();
  const {navigate} = useNavigator();

  return (
    <View style={[styles.itemBottom, {borderColor: theme.colors.surface[200]}]}>
      <View style={[styles.itemBottomPart]}>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="link-variant"
            size={16}
            color={category.color}
          />
          <TextContent style={styles.bottomMenuItemText}>0</TextContent>
        </View>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={16}
            color={category.color}
          />
          <TextContent style={styles.bottomMenuItemText}>10%</TextContent>
        </View>
      </View>
      <View style={[styles.itemBottomPart2]}>
        <Pressable
          style={[styles.bottomMenuItem]}
          onPress={() =>
            navigate('HabitInfo', {
              category,
              habit,
              tab: HABIT_INFO_TAB.CALENDAR,
            })
          }>
          <MaterialCommunityIcons
            name="calendar"
            size={22}
            color={theme.colors.surface[600]}
          />
        </Pressable>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="chart-bar"
            size={22}
            color={theme.colors.surface[600]}
          />
        </View>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={22}
            color={theme.colors.surface[600]}
          />
        </View>
      </View>
    </View>
  );
};

interface IDaysProps {
  habit: THabit;
  updateProgress: (habit: THabit, date: moment.Moment) => void;
  days: Moment[];
  history: IHistory[];
}

const Days = ({habit, updateProgress, days, history}: IDaysProps) => {
  const {theme} = useTheme();

  const isDisabled = (day: Moment) => {
    const startDate = moment(habit.startDate, 'DD/MM/YYYY');
    const {repeatConfig} = habit;

    if (day.isBefore(startDate)) return true;

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK)
      return !repeatConfig.days.includes(day.format('ddd') as any);

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH)
      return !repeatConfig.days.includes(day.format('D') as any);

    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
      return !repeatConfig.days.includes(day.format('MMMM D'));

    return false;
  };

  return (
    <View style={[styles.daysContainer]}>
      {days.map((day, index) => {
        const disabled = isDisabled(day);
        const opacity = disabled ? 0.4 : 1;

        const progress = history
          .find(h => h.date === day.format('DD/MM/YYYY'))
          ?.habits.find(h => h.habitId === habit.id);

        const color = disabled
          ? theme.colors.surface[200]
          : progress
          ? progress.completed
            ? commonColors.green
            : commonColors.red
          : day.isBefore(moment().startOf('day'))
          ? commonColors.orange
          : theme.colors.disabledText;

        return (
          <Pressable
            onPress={() => updateProgress(habit, day)}
            key={index}
            disabled={disabled}
            style={[styles.dayItem, {opacity}]}>
            <TextContent
              style={[styles.dayText, {color: theme.colors.disabledText}]}>
              {day.format('ddd')}
            </TextContent>
            <View
              style={[
                styles.dateContainer,
                {
                  backgroundColor: theme.colors.surface[200],
                  borderColor: color,
                },
              ]}>
              <TextContent>{day.date()}</TextContent>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  item: {
    // padding: 16,
    borderRadius: 16,
  },
  itemTop: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitNameContainer: {
    flexDirection: 'column',
    rowGap: 4,
  },
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
  daysContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    columnGap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  dayItem: {
    flexDirection: 'column',
    rowGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 10,
    fontFamily: 'Inter-Light',
  },
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  itemBottom: {
    padding: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBottomPart: {
    flexDirection: 'row',
    columnGap: 8,
  },
  itemBottomPart2: {
    flexDirection: 'row',
    columnGap: 16,
  },
  bottomMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  bottomMenuItemText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});
