import React, {useCallback, useEffect, useState} from 'react';
import getHabitModel, {
  COMPARISON_TYPE,
  HABIT_TYPES,
  REPEAT_TYPE,
  THabit,
} from '../database/models/habit';
import moment, {Moment} from 'moment';
import getHistoryModel, {IHistory} from '../database/models/history';
import {NumberInputModal} from '../screens/components/NumberInputModal';
import {CheckListModal} from '../screens/components/CheckListModal';
import {TimeInputModal} from '../screens/components/TimeInputModal';
import {
  HABIT_MODEL_EVENT,
  HISTORY_MODEL_EVENT,
  emitDatabaseEvent,
} from '../database/database';
import {addTimes, getSeconds, updateHabitAnalytics} from '../utils';
import {ToastAndroid} from 'react-native';

export const useHabitUpdate = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeHabit, setActiveHabit] = useState<THabit>();
  const [activeDate, setActiveDate] = useState<string>('');
  const [historyUpdated, setHistoryUpdated] = useState(0);
  const [progress, setProgress] =
    useState<IHistory['habits']['0']['progress']>();
  const [additionalProgressInTime, setAdditionalProgressInTime] = useState('');

  useEffect(() => {
    const historyModel = getHistoryModel();

    setProgress(() => {
      const currentProgress = historyModel
        .findOne({date: activeDate})
        ?.habits.find(record => record.habitId === activeHabit?.id)?.progress;

      if (
        activeHabit?.habitType === HABIT_TYPES.TIMER &&
        additionalProgressInTime
      ) {
        ToastAndroid.showWithGravity(
          `Adding ${additionalProgressInTime} with previous progress ${currentProgress}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );

        return addTimes(currentProgress as string, additionalProgressInTime);
      }

      return currentProgress;
    });
  }, [
    activeDate,
    activeHabit?.habitType,
    activeHabit?.id,
    additionalProgressInTime,
  ]);

  const getHistoryRecord = useCallback(() => {
    const historyModel = getHistoryModel();

    let record =
      historyModel.findOne({date: activeDate}) ||
      historyModel.insertOne({date: activeDate, habits: []});

    if (!activeHabit || !record) return;

    let habitProgress = record.habits.find(h => h.habitId === activeHabit.id);

    if (!habitProgress) {
      habitProgress = {
        habitId: activeHabit.id,
      };

      record.habits.push(habitProgress);
    }

    return record;
  }, [activeDate, activeHabit]);

  const updateProgressInDb = useCallback(
    (progress?: number | string | number[]) => {
      const record = getHistoryRecord();
      const habitProgress = record?.habits.find(
        h => h.habitId === activeHabit?.id,
      ); // TODO: Maybe use it from getHistoryRecord
      let shouldResetProgress = false;

      if (!activeHabit || !record || !habitProgress) return;

      const {habitConfig, habitType} = activeHabit;

      if (habitType === HABIT_TYPES.YES_OR_NO) {
        if (habitProgress.completed === false) shouldResetProgress = true;
        habitProgress.completed = !habitProgress.completed;
      }

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

      activeHabit.isCompleted = shouldResetProgress
        ? undefined
        : habitProgress.completed;

      if (shouldResetProgress)
        record.habits = record.habits.filter(
          habit => habit.habitId !== activeHabit.id,
        );

      updateHabitAnalytics(
        activeHabit,
        moment(activeDate, 'DD/MM/YYYY'),
        shouldResetProgress ? false : !!habitProgress.completed,
      );

      getHistoryModel().update(record);
      getHabitModel().update(activeHabit);

      setHistoryUpdated(prev => prev + 1);
      setOpenModal(false);
      setActiveDate('');
      setActiveHabit(undefined);
      setAdditionalProgressInTime('');

      emitDatabaseEvent(HISTORY_MODEL_EVENT.UPDATE_HISTORY);

      if (activeHabit.repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT)
        emitDatabaseEvent(HABIT_MODEL_EVENT.UPDATED_SINGLE_TASK);
    },
    [activeDate, activeHabit, getHistoryRecord],
  );

  const updateProgress = useCallback(
    (habit: THabit, date: Moment, additionalProgressInTime?: string) => {
      if (date.isAfter(moment().startOf('day'))) return;

      setActiveHabit(habit);
      setActiveDate(date.format('DD/MM/YYYY'));

      if (habit.habitType === HABIT_TYPES.NUMERIC) setOpenModal(true);

      if (habit.habitType === HABIT_TYPES.CHECKLIST) setOpenModal(true);

      if (habit.habitType === HABIT_TYPES.TIMER) {
        if (additionalProgressInTime)
          setAdditionalProgressInTime(additionalProgressInTime);

        setOpenModal(true);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeHabit?.habitType === HABIT_TYPES.YES_OR_NO) updateProgressInDb();
  }, [activeHabit, updateProgressInDb]);

  const HabitProgressModels = () => {
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

  return {updateProgress, HabitProgressModels, historyUpdated};
};
