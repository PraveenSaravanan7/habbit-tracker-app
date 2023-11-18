import moment, {Moment} from 'moment';
import {REPEAT_TYPE, THabit, THistoryItem} from './database/models/habit';
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

const getNthDay = (date: Moment, habit: THabit): number => {
  const {
    repeatConfig: {repeatType, days},
    startDate,
  } = habit;
  const start = moment(startDate, 'DD/MM/YYYY');

  if (repeatType === REPEAT_TYPE.NO_REPEAT) return 1;

  if (repeatType === REPEAT_TYPE.EVERY_DAY) return date.diff(start, 'day') + 1;

  let n = 0;
  const format =
    repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK
      ? 'ddd'
      : repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH
      ? 'D'
      : 'MMMM D';

  while (start.isSameOrBefore(date)) {
    if (days && (days as string[]).includes(start.format(format))) n++;

    start.add(1, 'day');
  }

  console.log(
    'getNthDay for ' +
      date.format('DD/MM/YYYY') +
      +'format ' +
      format +
      'n ' +
      n,
  );

  return n;
};

export const updateHabitAnalytics = (
  habit: THabit,
  date: Moment,
  completed: boolean,
) => {
  const {analytics} = habit;
  const currentDate = getNthDay(date, habit);

  if (completed && analytics.streaksHistory.length === 0) {
    analytics.streaksHistory = [[currentDate, currentDate, 1]];
    analytics.completedDays = 1;
    analytics.streaks = 1;

    return;
  }

  const streakHistoryCopy: [number, number, number][] = [];
  const ONE_DAY = 1;

  if (completed) {
    let inserted = false;

    for (let i = 0; i < analytics.streaksHistory.length; i++) {
      const item: THistoryItem = [...analytics.streaksHistory[i]];

      if (inserted) {
        const prev = streakHistoryCopy.at(-1) as [number, number, number];
        if (prev[1] + 1 === item[0]) {
          prev[1] = item[1];
          prev[2] += item[2];
        } else streakHistoryCopy.push(item);

        continue;
      }

      if (currentDate > item[0] && currentDate < item[1]) {
        item[2]++;
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      if (currentDate === item[0] - ONE_DAY) {
        item[0] = currentDate;
        item[2]++;
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      if (currentDate === item[1] + ONE_DAY) {
        item[1] = currentDate;
        item[2]++;
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      if (
        currentDate > item[1] &&
        (i === analytics.streaksHistory.length - 1
          ? true
          : currentDate < analytics.streaksHistory[i + 1][0])
      ) {
        streakHistoryCopy.push(item);
        streakHistoryCopy.push([currentDate, currentDate, 1]);
        inserted = true;
        continue;
      }

      if (
        currentDate < item[0] &&
        (i === 0 ? true : currentDate < analytics.streaksHistory[i - 1][0])
      ) {
        streakHistoryCopy.push([currentDate, currentDate, 1]);
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      streakHistoryCopy.push(item);
    }
  } else {
    let inserted = false;

    for (let i = 0; i < analytics.streaksHistory.length; i++) {
      const item: THistoryItem = [...analytics.streaksHistory[i]];

      if (inserted) {
        streakHistoryCopy.push(item);
        continue;
      }

      if (currentDate === item[0] && currentDate === item[1]) {
        inserted = true;
        continue;
      }

      if (currentDate === item[0]) {
        item[0] = currentDate + ONE_DAY;
        item[2]--;
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      if (currentDate === item[1]) {
        item[1] = currentDate - ONE_DAY;
        item[2]--;
        streakHistoryCopy.push(item);
        inserted = true;
        continue;
      }

      if (currentDate > item[0] && currentDate < item[1]) {
        const a: THistoryItem = [item[0], currentDate - 1, 0];
        a[2] = a[1] - a[0] + 1;
        streakHistoryCopy.push(a);

        const b: THistoryItem = [currentDate + 1, item[1], 0];
        b[2] = b[1] - b[0] + 1;
        streakHistoryCopy.push(b);

        inserted = true;
        continue;
      }

      streakHistoryCopy.push(item);
    }
  }

  const latestHistory = streakHistoryCopy[streakHistoryCopy.length - 1];

  analytics.streaks = latestHistory ? latestHistory[2] : 0;
  analytics.streaksHistory = streakHistoryCopy;

  console.log(analytics);
};
