import React, {useState} from 'react';
import {COMPARISON_TYPE, HABIT_TYPES, THabit} from '../database/models/habit';
import {Moment} from 'moment';
import getHistoryModel from '../database/models/history';
import {NumberInputModal} from '../screens/components/NumberInputModal';

export const useHabitUpdate = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeHabit, setActiveHabit] = useState<THabit>();
  const [activeDate, setActiveDate] = useState<string>('');

  const historyModel = getHistoryModel();

  const updateProgressInDb = (
    habit: THabit,
    date: string,
    progress?: number | string,
  ) => {
    let record =
      historyModel.findOne({date: date}) ||
      historyModel.insertOne({date: date, habits: []});

    if (!record) return;

    let habitProgress = record.habits.find(h => h.habitId === habit.id);

    if (!habitProgress) {
      habitProgress = {
        habitId: habit.id,
        completed: false,
      };

      record.habits.push(habitProgress);
    }

    if (habit.habitType === HABIT_TYPES.YES_OR_NO)
      habitProgress.completed = !habitProgress.completed;

    if (habit.habitType === HABIT_TYPES.NUMERIC) {
      if (
        habit.habitConfig?.goalNumber &&
        typeof habit.habitConfig?.goalNumber === 'number' &&
        typeof progress === 'number'
      ) {
        if (habit.habitConfig?.comparisonType === COMPARISON_TYPE.EXACTLY)
          habitProgress.completed = habit.habitConfig?.goalNumber === progress;
        if (habit.habitConfig?.comparisonType === COMPARISON_TYPE.ANY_VALUE)
          habitProgress.completed = undefined !== progress;
        if (habit.habitConfig?.comparisonType === COMPARISON_TYPE.AT_LEAST)
          habitProgress.completed = progress >= habit.habitConfig.goalNumber;
        if (habit.habitConfig?.comparisonType === COMPARISON_TYPE.LESS_THAN)
          habitProgress.completed = progress < habit.habitConfig.goalNumber;
      }

      habitProgress.progress = progress;
    }

    historyModel.update(record);

    setActiveDate('');
    setActiveHabit(undefined);
  };

  const updateProgress = (habit: THabit, date: Moment) => {
    setActiveHabit(habit);
    setActiveDate(date.format('DD/MM/YYYY'));

    if (habit.habitType === HABIT_TYPES.YES_OR_NO)
      updateProgressInDb(habit, date.format('DD/MM/YYYY'));

    if (habit.habitType === HABIT_TYPES.NUMERIC) setOpenModal(true);
  };

  const UpdateUi = () => {
    if (activeHabit?.habitType === HABIT_TYPES.NUMERIC)
      return (
        <NumberInputModal
          isOpen={openModal}
          title="Goal"
          updateNumber={val => updateProgressInDb(activeHabit, activeDate, val)}
          updateVisibility={visibility => setOpenModal(visibility)}
          defaultValue={
            historyModel
              .findOne({date: activeDate})
              ?.habits.find(record => record.habitId === activeHabit.id)
              ?.progress as number
          }
          targetValue={activeHabit.habitConfig?.goalNumber}
        />
      );

    return null;
  };

  return {updateProgress, UpdateUi};
};