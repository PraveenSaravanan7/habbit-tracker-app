import React from 'react';
import {View} from 'react-native';
import {DateRange} from './DateRange';
import {Moment} from 'moment';

export interface ITodayProps {
  currentDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}

export const Today = ({currentDate, updateCurrentDate}: ITodayProps) => {
  return (
    <View>
      <DateRange
        currentDate={currentDate}
        updateCurrentDate={updateCurrentDate}
      />
    </View>
  );
};
