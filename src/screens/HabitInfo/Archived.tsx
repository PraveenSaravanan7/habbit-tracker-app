import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, ToastAndroid, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getHabitModel, {THabit} from '../../database/models/habit';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {convertHexToRGBA} from '../../utils';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import {CategoryIcon} from '../components/CategoryIcon';
import {Header} from '../../components/Header';
import {HABIT_MODEL_EVENT, emitDatabaseEvent} from '../../database/database';

export const Archived = () => {
  const {theme} = useTheme();

  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories] = useState<ICategory[]>(() => getCategoryModel().find());

  const updateHabit = useCallback(
    () =>
      setHabits(() =>
        [...getHabitModel().find()].filter(habit => habit.archived),
      ),
    [],
  );

  const unArchive = (habit: THabit) => {
    habit.archived = false;
    getHabitModel().update(habit);
    updateHabit();
    emitDatabaseEvent(HABIT_MODEL_EVENT.UPDATE_HABIT);

    ToastAndroid.showWithGravity(
      'Unarchived',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
  };

  const getCategory = (habit: THabit) =>
    categories.find(category => category.id === habit.category);

  useEffect(() => updateHabit(), [updateHabit]);

  return (
    <View>
      <Header
        title="Archived"
        icon={
          <MaterialCommunityIcons
            name="archive-arrow-up-outline"
            size={28}
            color="#fff"
          />
        }
      />

      <View style={[styles.container]}>
        {habits.map((habit, key) => {
          const category = getCategory(habit);

          if (!category) return null;

          return (
            <Pressable
              onPress={() => unArchive(habit)}
              style={[
                styles.item,
                {backgroundColor: theme.colors.surface[100]},
              ]}
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
                      {habit.isTask ? 'Task' : 'Habit'}
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

                <CategoryIcon
                  category={category}
                  size={36}
                  borderRadius={12}
                  iconSize={22}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingHorizontal: 16,
    marginTop: 100,
  },
  item: {
    // padding: 16,
    borderRadius: 16,
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
  habitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  itemTop: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
