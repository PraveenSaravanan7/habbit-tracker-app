import React, {useState} from 'react';
import {HABIT_TYPES, THabit} from '../database/models/habit';
import {Moment} from 'moment';
import getHistoryModel from '../database/models/history';
import {View} from 'react-native';
import {Modal} from '../components/Modal';
import {TextContent} from '../components/TextContent';

export const useHabitUpdate = () => {
  const [openModal, setOpenModal] = useState(false);
  const [activeHabit, setActiveHabit] = useState<THabit>();

  const updateProgressInDb = (
    habit: THabit,
    date: string,
    progress?: number | string,
  ) => {
    const historyModel = getHistoryModel();

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
      habitProgress.completed = habit.habitConfig?.goalNumber === progress;
      habitProgress.progress = progress;
    }

    historyModel.update(record);

    console.log('Updating record', record, habitProgress);
  };

  const updateProgress = (habit: THabit, date: Moment) => {
    setActiveHabit(habit);

    if (habit.habitType === HABIT_TYPES.YES_OR_NO)
      updateProgressInDb(habit, date.format('DD/MM/YYYY'));

    if (habit.habitType === HABIT_TYPES.NUMERIC) {
      setOpenModal(true);
    }
  };

  const NumericUpdate = () => (
    <View>
      <TextContent>Numeric update</TextContent>
    </View>
  );

  const UpdateUi = () => {
    return (
      <Modal isVisible={openModal} updateVisibility={v => setOpenModal(v)}>
        <>
          {activeHabit?.habitType === HABIT_TYPES.NUMERIC && <NumericUpdate />}
        </>
      </Modal>
    );
  };

  return {updateProgress, UpdateUi};
};
