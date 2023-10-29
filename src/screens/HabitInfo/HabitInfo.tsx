import React from 'react';
import {View} from 'react-native';
import {Header} from '../../components/Header';
import {useRouter} from '../../../NavigationUtils';
import {CategoryIcon} from '../components/CategoryIcon';

export enum HABIT_INFO_TAB {
  CALENDAR,
  STATS,
  EDIT,
}

export const HabitInfo = () => {
  const {
    params: {habit, category},
  } = useRouter<'HabitInfo'>();

  return (
    <View>
      <Header
        title={habit.habitName}
        icon={
          <CategoryIcon
            borderRadius={8}
            size={28}
            iconSize={16}
            category={category}
          />
        }
      />
    </View>
  );
};
