enum HABIT_TYPES {
  YES_OR_NO,
  NUMERIC,
  TIMER,
  CHECKLIST,
}

export enum REPEAT_TYPE {
  EVERY_DAY,
  DAY_OF_THE_MONTH,
  DAY_OF_THE_WEEK,
  DAY_OF_THE_YEAR,
}

export enum DAY_OF_THE_WEEK {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export enum DAY_OF_THE_MONTH {
  ONE = 1,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  ELEVEN,
  TWELVE,
  THIRTEEN,
  FOURTEEN,
  FIFTEEN,
  SIXTEEN,
  SEVENTEEN,
  EIGHTEEN,
  NINETEEN,
  TWENTY,
  TWENTYONE,
  TWENTYTWO,
  TWENTYTHREE,
  TWENTYFOUR,
  TWENTYFIVE,
  TWENTYSIX,
  TWENTYSEVEN,
  TWENTYEIGHT,
  TWENTYNINE,
  THIRTY,
  THIRTYONE,
}

interface IRepeatConfig<
  RepeatType extends REPEAT_TYPE,
  Days extends DAY_OF_THE_WEEK[] | DAY_OF_THE_MONTH[] | Date[] | undefined,
> {
  repeatType: RepeatType;
  days?: Days;
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
    | IRepeatConfig<REPEAT_TYPE.DAY_OF_THE_YEAR, Date[]>;
  startDate: string;
  endDate?: string;
  priority: number;
}

interface INumericHabit
  extends IHabitBase<
    HABIT_TYPES.NUMERIC,
    {goalNumber: number; unitName: string}
  > {}

interface ITimerHabit
  extends IHabitBase<HABIT_TYPES.TIMER, {minutes: number}> {}

interface ICheckListHabit
  extends IHabitBase<HABIT_TYPES.CHECKLIST, {checkList: string[]}> {}

interface IYesOrNoHabit extends IHabitBase<HABIT_TYPES.YES_OR_NO, undefined> {}

export type THabit =
  | ICheckListHabit
  | INumericHabit
  | ITimerHabit
  | IYesOrNoHabit;
