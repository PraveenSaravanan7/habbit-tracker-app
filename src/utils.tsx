import moment, {Moment} from 'moment';
import {REPEAT_TYPE, THabit} from './database/models/habit';
import {IHistory} from './database/models/history';

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {
  if (!hexCode.startsWith('#')) return hexCode;

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
  const endDate = moment(habit.endDate, 'DD/MM/YYYY');
  const {repeatConfig} = habit;

  if (day.isBefore(startDate)) return true;

  if (day.isAfter(endDate)) return true;

  if (!ignoreFutureCheck && day.isAfter(moment().endOf('day'))) return true;

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK)
    return !repeatConfig.days.includes(day.format('ddd') as any);

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH)
    return !repeatConfig.days.includes(day.format('D') as any);

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
    return !repeatConfig.days.includes(day.format('MMMM D'));

  return false;
};

export enum DAY_COLOR {
  DISABLED,
  COMPLETED,
  IN_COMPLETE,
  IN_PROGRESS,
  NO_PROGRESS,
  NO_PROGRESS_OLD,
}

export const getDayColor = (
  day: Moment,
  disabled: boolean,
  colorMap: Record<DAY_COLOR, string[]>,
  progressInfo?: IHistory['habits'][0],
): string[] => {
  const today = moment().startOf('day');

  if (disabled) return colorMap[DAY_COLOR.DISABLED];

  if (progressInfo?.completed) return colorMap[DAY_COLOR.COMPLETED];

  if (progressInfo) {
    // INFO: Non yes or no tasks
    if (day.isSame(today) && progressInfo.progress)
      return colorMap[DAY_COLOR.IN_PROGRESS];

    return colorMap[DAY_COLOR.IN_COMPLETE];
  }

  if (day.isBefore(today)) return colorMap[DAY_COLOR.NO_PROGRESS_OLD];

  return colorMap[DAY_COLOR.NO_PROGRESS];
};

export const getDayColorAndIsDisabled = (
  day: Moment,
  habit: THabit,
  colorMap: Record<DAY_COLOR, string[]>,
  history: IHistory[],
) => {
  const progress = history
    .find(h => h.date === day.format('DD/MM/YYYY'))
    ?.habits.find(h => h.habitId === habit.id);

  const disabled = isDayDisabled(day, habit);

  const color = getDayColor(day, disabled, colorMap, progress);

  return {disabled, color: color[0]};
};

export const getRepeatText = ({repeatConfig}: THabit) => {
  if (repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT) return 'Not repeated';

  if (repeatConfig.repeatType === REPEAT_TYPE.EVERY_DAY) return 'Every day';

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK)
    return repeatConfig.days.join('-');

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH)
    return 'Days of the month: ' + repeatConfig.days.join(', ');

  if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
    return repeatConfig.days.join(', ');

  return '';
};

export const addTimes = (a: string, b: string): string =>
  formatTime(getSeconds(a) + getSeconds(b));

export const getSeconds = (time: string) => {
  const [hours, minutes, seconds] = time.split(':');

  return +hours * 60 * 60 + +minutes * 60 + +seconds;
};

export const formatTime = (time: number) => {
  const pad = (val: number) => String(val).padStart(2, '0');
  const hours = pad(Math.floor(time / 3600));
  const minutes = pad(Math.floor((time % 3600) / 60));
  const seconds = pad(Math.floor(time % 60));

  return `${hours}:${minutes}:${seconds}`;
};
