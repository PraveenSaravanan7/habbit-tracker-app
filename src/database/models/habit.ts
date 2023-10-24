import COLLECTION from '../collections';
import database from '../database';

export enum HABIT_TYPES {
  YES_OR_NO,
  NUMERIC,
  TIMER,
  CHECKLIST,
}

export enum COMPARISON_TYPE {
  AT_LEAST = 'At least',
  LESS_THAN = 'Less than',
  EXACTLY = 'Exactly',
  ANY_VALUE = 'Any value',
}

export enum REPEAT_TYPE {
  EVERY_DAY,
  DAY_OF_THE_MONTH,
  DAY_OF_THE_WEEK,
  DAY_OF_THE_YEAR,
}

export enum DAY_OF_THE_WEEK {
  SUNDAY = 'Sun',
  MONDAY = 'Mon',
  TUESDAY = 'Tue',
  WEDNESDAY = 'Wed',
  THURSDAY = 'Thu',
  FRIDAY = 'Fri',
  SATURDAY = 'Sat',
}

export enum DAY_OF_THE_MONTH {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  ELEVEN = '11',
  TWELVE = '12',
  THIRTEEN = '13',
  FOURTEEN = '14',
  FIFTEEN = '15',
  SIXTEEN = '16',
  SEVENTEEN = '17',
  EIGHTEEN = '18',
  NINETEEN = '19',
  TWENTY = '20',
  TWENTYONE = '21',
  TWENTYTWO = '22',
  TWENTYTHREE = '23',
  TWENTYFOUR = '24',
  TWENTYFIVE = '25',
  TWENTYSIX = '26',
  TWENTYSEVEN = '27',
  TWENTYEIGHT = '28',
  TWENTYNINE = '29',
  THIRTY = '30',
  THIRTYONE = '31',
  LAST = 'Last',
}

export enum MONTHS {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December',
}

interface IRepeatConfig<
  RepeatType extends REPEAT_TYPE,
  Days extends DAY_OF_THE_WEEK[] | DAY_OF_THE_MONTH[] | string[] | undefined,
> {
  repeatType: RepeatType;
  days: Days;
}

interface IHabitBase<
  HabitType extends HABIT_TYPES,
  HabitConfig extends Record<string, string | string[] | number> | undefined,
> {
  habitType: HabitType;
  habitConfig?: HabitConfig;
  category: string;
  habitName: string;
  habitDescription: string;
  repeatConfig:
    | IRepeatConfig<REPEAT_TYPE.EVERY_DAY, undefined>
    | IRepeatConfig<REPEAT_TYPE.DAY_OF_THE_WEEK, DAY_OF_THE_WEEK[]>
    | IRepeatConfig<REPEAT_TYPE.DAY_OF_THE_MONTH, DAY_OF_THE_MONTH[]>
    | IRepeatConfig<REPEAT_TYPE.DAY_OF_THE_YEAR, string[]>;
  startDate: string;
  endDate?: string;
  priority: number;
}

interface INumericHabit
  extends IHabitBase<
    HABIT_TYPES.NUMERIC,
    {comparisonType: COMPARISON_TYPE; goalNumber: number; unitName: string}
  > {}

interface ITimerHabit
  extends IHabitBase<
    HABIT_TYPES.TIMER,
    {comparisonType: COMPARISON_TYPE; duration: string}
  > {}

interface ICheckListHabit
  extends IHabitBase<HABIT_TYPES.CHECKLIST, {checkList: string[]}> {}

interface IYesOrNoHabit extends IHabitBase<HABIT_TYPES.YES_OR_NO, undefined> {}

export type THabit =
  | ICheckListHabit
  | INumericHabit
  | ITimerHabit
  | IYesOrNoHabit;

const getHabitModel = () => database.getCollection<THabit>(COLLECTION.HABITS);

export default getHabitModel;
