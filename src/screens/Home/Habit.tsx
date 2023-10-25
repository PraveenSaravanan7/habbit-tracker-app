import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import getHabitModel, {
  HABIT_MODEL_EVENT,
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

export const Habit = () => {
  const habitModel = getHabitModel();
  const categoryModel = getCategoryModel();

  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const {theme} = useTheme();

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

  useEffect(() => {
    const updateHabit = () => {
      console.log('updateHabit');
      setHabits(habitModel.find().sort((a, b) => b.priority - a.priority));
    };

    database.addListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);

    return () =>
      database.removeListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);
  }, [habitModel]);

  useEffect(() => {
    setHabits(habitModel.find().sort((a, b) => b.priority - a.priority));
    setCategories(categoryModel.find());

    console.log('--- called');
  }, [categoryModel, habitModel]);

  return (
    <View style={[styles.container]}>
      {habits.map((habit, key) => {
        const category = getCategory(habit);

        if (!category) return null;

        return (
          <View
            style={[styles.item, {backgroundColor: theme.colors.surface[100]}]}
            key={key}>
            <View style={[styles.itemTop]}>
              <View style={styles.habitNameContainer}>
                <TextContent style={[styles.habitName]}>
                  {habit.habitName}
                </TextContent>
                <View
                  style={[
                    styles.label,
                    {backgroundColor: convertHexToRGBA(category.color, 0.2)},
                  ]}>
                  <TextContent
                    style={[styles.labelText, {color: category.color}]}>
                    {getRepeatText(habit)}
                  </TextContent>
                </View>
              </View>

              <View style={[styles.icon, {backgroundColor: category.color}]}>
                <MaterialCommunityIcons
                  name={category.icon}
                  size={22}
                  color={'#fff'}
                />
              </View>
            </View>
            <Days habit={habit} />
            <BottomMenu habit={habit} category={category} />
          </View>
        );
      })}
    </View>
  );
};

interface IBottomMenuProps {
  habit: THabit;
  category: ICategory;
}

const BottomMenu = ({habit, category}: IBottomMenuProps) => {
  const {theme} = useTheme();

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
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="calendar"
            size={22}
            color={theme.colors.surface[600]}
          />
        </View>
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
}

const Days = ({habit}: IDaysProps) => {
  const {theme} = useTheme();

  const [days] = useState<Moment[]>(() => {
    const list: Moment[] = [];

    let i = -7;

    while (i++) list.push(moment().add(i, 'days'));

    return list;
  });
  return (
    <View style={[styles.daysContainer]}>
      {days.map(day => (
        <View style={[styles.dayItem]}>
          <TextContent
            style={[styles.dayText, {color: theme.colors.disabledText}]}>
            {day.format('ddd')}
          </TextContent>
          <View
            style={[
              styles.dateContainer,
              {backgroundColor: theme.colors.surface[200]},
            ]}>
            <TextContent>{day.date()}</TextContent>
          </View>
        </View>
      ))}
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
    borderRadius: 8,
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
    padding: 6,
    borderRadius: 12,
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
