import React from 'react';
import {useTheme} from '../../../ThemeProvider';
import {commonColors} from '../../../themes';
import {HABIT_TYPES, THabit} from '../../database/models/habit';
import {IHistory} from '../../database/models/history';
import {DAY_COLOR, convertHexToRGBA, getDayColor} from '../../utils';
import moment, {Moment} from 'moment';
import {StyleSheet, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ProgressButton = ({
  habit,
  progress,
  currentDate,
}: {
  habit: THabit;
  progress?: IHistory['habits'][0];
  currentDate: Moment;
}) => {
  const {theme} = useTheme();

  const colorMap: Record<DAY_COLOR, string[]> = {
    [DAY_COLOR.COMPLETED]: [
      convertHexToRGBA(commonColors.green, 0.2),
      commonColors.green,
    ],
    [DAY_COLOR.DISABLED]: [
      theme.colors.surface[200],
      theme.colors.surface[400],
    ],
    [DAY_COLOR.IN_COMPLETE]: [
      convertHexToRGBA(commonColors.red, 0.2),
      commonColors.red,
    ],
    [DAY_COLOR.IN_PROGRESS]: [
      convertHexToRGBA(commonColors.orange, 0.2),
      commonColors.orange,
    ],
    [DAY_COLOR.NO_PROGRESS]: [theme.colors.surface[200]],
    [DAY_COLOR.NO_PROGRESS_OLD]: [theme.colors.surface[200]],
  };

  const color = getDayColor(currentDate, false, colorMap, progress);

  if (currentDate.isAfter(moment().startOf('day')))
    return (
      <View style={[styles.progressButton, {backgroundColor: color[0]}]}>
        <MaterialCommunityIcons
          color={color[1]}
          size={24}
          name="lock-outline"
        />
      </View>
    );

  return (
    <View style={[styles.progressButton, {backgroundColor: color[0]}]}>
      {progress && (
        <MaterialCommunityIcons
          color={color[1]}
          size={24}
          name={
            progress.completed
              ? 'check-bold'
              : habit.habitType === HABIT_TYPES.YES_OR_NO
              ? 'close-thick'
              : 'dots-horizontal'
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  progressButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    borderRadius: 100,
  },
});
