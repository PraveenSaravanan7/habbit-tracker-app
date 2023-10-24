import React, {useEffect} from 'react';
import {View} from 'react-native';
import getHabitModel from '../../database/models/habit';

export const Habit = () => {
  const habitModel = getHabitModel();

  useEffect(() => {
    console.log(habitModel.find());
  }, []);

  return <View></View>;
};
