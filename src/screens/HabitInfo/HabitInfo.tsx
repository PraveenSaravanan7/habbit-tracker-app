import React from 'react';
import {View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';

export enum HABIT_INFO_TAB {
  CALENDAR,
  STATS,
  EDIT,
}

export const HabitInfo = () => {
  const {
    params: {habit},
  } = useRouter<'HabitInfo'>();

  return (
    <View>
      <Header title={habit.habitName} />
    </View>
  );
};
