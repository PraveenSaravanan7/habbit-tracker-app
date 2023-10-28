import React, {useState} from 'react';
import {COMPARISON_TYPE, HABIT_TYPES, THabit} from '../database/models/habit';
import {Moment} from 'moment';
import getHistoryModel from '../database/models/history';
import {NumberInputModal} from '../screens/components/NumberInputModal';
import {CheckListModal} from '../screens/components/CheckListModal';
import {TimeInputModal} from '../screens/components/TimeInputModal';

export const useHabitUpdate = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeHabit, setActiveHabit] = useState<THabit>();
  const [activeDate, setActiveDate] = useState<string>('');

  const historyModel = getHistoryModel();

  const getHistoryRecord = () => {
    let record =
      historyModel.findOne({date: activeDate}) ||
      historyModel.insertOne({date: activeDate, habits: []});

    if (!activeHabit || !record) return;

    let habitProgress = record.habits.find(h => h.habitId === activeHabit.id);

    if (!habitProgress) {
      habitProgress = {
        habitId: activeHabit.id,
        completed: false,
      };

      record.habits.push(habitProgress);
    }

    return record;
  };

  const updateProgressInDb = (progress?: number | string | number[]) => {
    const record = getHistoryRecord();
    const habitProgress = record?.habits.find(
      h => h.habitId === activeHabit?.id,
    ); // TODO: Maybe use it from getHistoryRecord

    if (!activeHabit || !record || !habitProgress) return;

    const {habitConfig, habitType} = activeHabit;

    if (habitType === HABIT_TYPES.YES_OR_NO)
      habitProgress.completed = !habitProgress.completed;

    if (habitType === HABIT_TYPES.CHECKLIST && typeof progress === 'object')
      habitProgress.completed =
        progress.length === habitConfig?.checkList.length;

    if (
      habitType === HABIT_TYPES.NUMERIC &&
      habitConfig?.goalNumber &&
      typeof habitConfig?.goalNumber === 'number' &&
      typeof progress === 'number'
    ) {
      if (habitConfig?.comparisonType === COMPARISON_TYPE.EXACTLY)
        habitProgress.completed = habitConfig?.goalNumber === progress;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.ANY_VALUE)
        habitProgress.completed = undefined !== progress;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.AT_LEAST)
        habitProgress.completed = progress >= habitConfig.goalNumber;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.LESS_THAN)
        habitProgress.completed = progress < habitConfig.goalNumber;
    }

    if (
      habitType === HABIT_TYPES.TIMER &&
      habitConfig?.duration &&
      typeof habitConfig?.duration === 'string' &&
      typeof progress === 'string'
    ) {
      const getSeconds = (time: string) => {
        const [hours, minutes, seconds] = time.split(':');

        return +hours * 60 * 60 + +minutes * 60 + +seconds;
      };

      const progressNumber = getSeconds(progress);
      const targetNumber = getSeconds(habitConfig.duration);

      if (habitConfig?.comparisonType === COMPARISON_TYPE.EXACTLY)
        habitProgress.completed = progressNumber === targetNumber;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.ANY_VALUE)
        habitProgress.completed = progressNumber !== 0;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.AT_LEAST)
        habitProgress.completed = progressNumber >= targetNumber;

      if (habitConfig?.comparisonType === COMPARISON_TYPE.LESS_THAN)
        habitProgress.completed = progressNumber < targetNumber;
    }

    habitProgress.progress = progress;

    historyModel.update(record);
  };

  const updateProgress = (habit: THabit, date: Moment) => {
    setActiveHabit(habit);
    setActiveDate(date.format('DD/MM/YYYY'));

    if (habit.habitType === HABIT_TYPES.YES_OR_NO) updateProgressInDb();

    if (habit.habitType === HABIT_TYPES.NUMERIC) setOpenModal(true);

    if (habit.habitType === HABIT_TYPES.CHECKLIST) setOpenModal(true);

    if (habit.habitType === HABIT_TYPES.TIMER) setOpenModal(true);
  };

  const UpdateUi = () => {
    const progress = historyModel
      .findOne({date: activeDate})
      ?.habits.find(record => record.habitId === activeHabit?.id)?.progress;

    if (activeHabit?.habitType === HABIT_TYPES.NUMERIC)
      return (
        <NumberInputModal
          isOpen={openModal}
          title="Goal"
          updateNumber={val => updateProgressInDb(val)}
          updateVisibility={visibility => setOpenModal(visibility)}
          defaultValue={progress as number}
          targetValue={activeHabit.habitConfig?.goalNumber}
        />
      );

    if (activeHabit?.habitType === HABIT_TYPES.CHECKLIST)
      return (
        <CheckListModal
          isOpen={openModal}
          updateVisibility={visibility => setOpenModal(visibility)}
          defaultChecked={progress as number[]}
          updateChecked={progress => updateProgressInDb(progress)}
          list={activeHabit.habitConfig?.checkList || []}
        />
      );

    if (activeHabit?.habitType === HABIT_TYPES.TIMER)
      return (
        <TimeInputModal
          isOpen={openModal}
          title="Goal"
          updateTime={val => updateProgressInDb(val)}
          updateVisibility={visibility => setOpenModal(visibility)}
          defaultValue={progress as string}
          targetValue={activeHabit.habitConfig?.duration}
        />
      );

    return null;
  };

  return {updateProgress, UpdateUi};
};
