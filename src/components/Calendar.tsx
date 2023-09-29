import React, {useCallback, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {TextContent} from './TextContent';
import moment, {Moment} from 'moment';

interface ICalendar {
  selectedDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}

const dateFormat = 'MMMM YYYY';

export const Calendar = ({selectedDate, updateCurrentDate}: ICalendar) => {
  const {theme} = useTheme();

  const [month, setMonth] = useState(moment(selectedDate).startOf('month'));

  const moveMonth = (noOfMonth: number) =>
    setMonth(prev => moment(prev).add(noOfMonth, 'M'));

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.surface[100]}]}>
      <Header month={month} moveMonth={moveMonth} />
      <Grid
        month={month}
        selectedDate={selectedDate}
        updateCurrentDate={updateCurrentDate}
      />
    </View>
  );
};

const Header = ({
  month,
  moveMonth,
}: {
  month: Moment;
  moveMonth: (n: number) => void;
}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.header]}>
      <Pressable onPress={() => moveMonth(-1)}>
        <MaterialCommunityIcons
          name="chevron-left"
          color={theme.colors.primary[100]}
          size={28}
        />
      </Pressable>
      <View style={[styles.headerMonthAndYearContainer]}>
        <TextContent>
          <Text style={[styles.mounthText, {color: theme.colors.text}]}>
            {moment(month, dateFormat).format('MMMM')}
          </Text>
        </TextContent>
        <TextContent>
          <Text style={[styles.yearText, {color: theme.colors.text}]}>
            {moment(month, dateFormat).format('YYYY')}
          </Text>
        </TextContent>
      </View>
      <Pressable onPress={() => moveMonth(1)}>
        <MaterialCommunityIcons
          name="chevron-right"
          color={theme.colors.primary[100]}
          size={28}
        />
      </Pressable>
    </View>
  );
};

const Grid = ({
  month,
  selectedDate,
  updateCurrentDate,
}: {
  month: Moment;
  selectedDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}) => {
  const {theme} = useTheme();

  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  //   const days = useDays({date: moment(month, dateFormat).startOf('month')});

  return (
    <>
      <View style={[styles.daysOfTheWeekContainer]}>
        {dayOfWeek.map((day, index) => {
          const color =
            index === 0 || index === 6
              ? theme.colors.primary[100]
              : theme.colors.text;

          return (
            <View key={index} style={[styles.dayOfTheWeekItem]}>
              <TextContent>
                <Text style={[styles.yearText, {color}]}>{day}</Text>
              </TextContent>
            </View>
          );
        })}
      </View>
      <Days
        month={month}
        selectedDate={selectedDate}
        updateCurrentDate={updateCurrentDate}
      />
    </>
  );
};

const Days = ({
  month,
  selectedDate,
  updateCurrentDate,
}: {
  month: Moment;
  selectedDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}) => {
  const {theme} = useTheme();

  const Item = useCallback(
    ({day}: {day: Moment}) => {
      const backgroundColor = selectedDate.isSame(day)
        ? theme.colors.primary[100]
        : theme.colors.surface[200];
      const opacity = day.month() === month.month() ? 1 : 0.25;
      const fontFamily = selectedDate.isSame(day)
        ? 'Inter-Bold'
        : 'Inter-Regular';

      return (
        <Pressable
          disabled={day.month() !== month.month()}
          style={[styles.dayItem, {backgroundColor, opacity}]}
          onPress={() => updateCurrentDate(day)}>
          <TextContent>
            <Text style={[{fontFamily}]}>{day.format('DD')}</Text>
          </TextContent>
        </Pressable>
      );
    },
    [theme, month, selectedDate, updateCurrentDate],
  );

  const startDate = moment(month).subtract(month.weekday(), 'days');
  const daysList: JSX.Element[][] = [];
  const total = 6 * 7;

  for (let i = 0; i < total; i++) {
    const y = Math.floor(i / 7);

    if (!daysList[y]) {
      daysList[y] = [];
    }

    daysList[y].push(<Item key={i} day={moment(startDate).add(i, 'day')} />);
  }

  return (
    <View style={[styles.daysContainer]}>
      {daysList.map((list, index) => (
        <View style={[styles.dayItemContainer]} key={index}>
          {list}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 20,
    padding: 16,
    rowGap: 16,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerMonthAndYearContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 4,
  },
  mounthText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  yearText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  daysOfTheWeekContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // paddingHorizontal: 8,
    // backgroundColor: 'red',
  },
  dayOfTheWeekItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  daysContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    rowGap: 8,
  },
  dayItem: {
    flex: 1,
    // height: 42,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayItemContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    columnGap: 8,
    // paddingHorizontal: 8,
    // backgroundColor: 'red',
  },
});
