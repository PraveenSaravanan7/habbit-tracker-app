import moment, {Moment} from 'moment';
import {REPEAT_TYPE, THabit} from './database/models/habit';
import {ITheme, commonColors} from '../themes';
import {IHistory} from './database/models/history';

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  let hex = hexCode.replace('#', '');

  if (hex.length === 3)
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  /* Backward compatibility for whole number based opacity values. */
  if (opacity > 1 && opacity <= 100) opacity = opacity / 100;

  return `rgba(${r},${g},${b},${opacity})`;
};

export const isDayDisabled = (
  day: Moment,
  habit: THabit,
  ignoreFutureCheck = false,
) => {
  const startDate = moment(habit.startDate, 'DD/MM/YYYY');
  const {repeatConfig} = habit;

  if (day.isBefore(startDate)) return true;

  if (!ignoreFutureCheck && day.isAfter(moment().endOf('day'))) return true;

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK)
    return !repeatConfig.days.includes(day.format('ddd') as any);

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH)
    return !repeatConfig.days.includes(day.format('D') as any);

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
    return !repeatConfig.days.includes(day.format('MMMM D'));

  return false;
};

export const getDayColor = (
  day: Moment,
  disabled: boolean,
  theme: ITheme,
  progress?: IHistory['habits'][0],
) => {
  const today = moment().startOf('day');

  if (disabled) return theme.colors.surface[200];

  if (progress) {
    if (progress.completed) return commonColors.green;

    if (day.isSame(today)) return commonColors.orange;

    return commonColors.red;
  }

  if (day.isBefore(today)) return commonColors.orange;

  return theme.colors.disabledText;
};

export const getDayColorAndIsDisabled = (
  day: Moment,
  habit: THabit,
  theme: ITheme,
  history: IHistory[],
) => {
  const progress = history
    .find(h => h.date === day.format('DD/MM/YYYY'))
    ?.habits.find(h => h.habitId === habit.id);

  const disabled = isDayDisabled(day, habit);

  const color = getDayColor(day, disabled, theme, progress);

  return {disabled, color};
};
