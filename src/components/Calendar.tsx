import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {TextContent} from './TextContent';
import moment, {Moment} from 'moment';
import {Modal} from './Modal';

export interface ICalendar {
  selectedDate?: Moment;
  updateCurrentDate: (date: Moment) => void;
  startDate?: Moment;
}

const dateFormat = 'MMMM YYYY';

export const Calendar = ({
  selectedDate,
  updateCurrentDate,
  startDate,
}: ICalendar) => {
  const {theme} = useTheme();

  const [month, setMonth] = useState(
    moment(selectedDate || startDate).startOf('month'),
  );

  const moveMonth = (noOfMonth: number) =>
    setMonth(prev => moment(prev).add(noOfMonth, 'M'));

  const moveYear = (noOfYear: number) =>
    setMonth(prev => moment(prev).add(noOfYear, 'years'));

  useEffect(() => {
    if (selectedDate && selectedDate.month() !== month.month())
      setMonth(moment(selectedDate).startOf('month'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.surface[100]}]}>
      <Header month={month} moveMonth={moveMonth} moveYear={moveYear} />
      <Grid
        month={month}
        selectedDate={selectedDate}
        updateCurrentDate={updateCurrentDate}
        startDate={startDate}
      />
    </View>
  );
};

export interface IYearAndMonthModalProps {
  isVisible: boolean;
  updateVisibility: (isVisible: boolean) => void;
  month: Moment;
  moveMonth: (n: number) => void;
  moveYear: (n: number) => void;
}
const YearAndMonthModal = ({
  isVisible,
  updateVisibility,
  month,
  moveMonth,
  moveYear,
}: IYearAndMonthModalProps) => {
  const {theme} = useTheme();
  const [noYear, setNoYear] = useState(0);
  const [noMonth, setNoMonth] = useState(0);

  const closeModal = () => updateVisibility(false);

  const onOk = () => {
    moveMonth(noMonth);
    moveYear(noYear);
    closeModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      updateVisibility={updateVisibility}
      width={'80%'}>
      <View
        style={[
          styles.yearAndMonthModalContainer,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View
          style={[
            styles.yearSelectorHead,
            {borderColor: theme.colors.surface[200]},
          ]}>
          <TextContent>
            <Text
              style={[
                styles.yearSelectorHeadText,
                {color: theme.colors.disabledText},
              ]}>
              Select a date
            </Text>
          </TextContent>
        </View>
        <View style={[styles.yearSelector]}>
          <HorizontalMover
            onLeftPress={() => setNoYear(prev => prev - 1)}
            onRightPress={() => setNoYear(prev => prev + 1)}>
            <TextContent>
              <Text style={[styles.mounthText, {color: theme.colors.text}]}>
                {moment(month, dateFormat).add(noYear, 'years').format('YYYY')}
              </Text>
            </TextContent>
          </HorizontalMover>
          <HorizontalMover
            onLeftPress={() => setNoMonth(prev => prev - 1)}
            onRightPress={() => setNoMonth(prev => prev + 1)}>
            <TextContent>
              <Text style={[styles.mounthText, {color: theme.colors.text}]}>
                {moment(month, dateFormat)
                  .add(noMonth, 'months')
                  .format('MMMM')}
              </Text>
            </TextContent>
          </HorizontalMover>
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={closeModal}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent>
              <Text style={[styles.buttonText]}>CANCEL</Text>
            </TextContent>
          </Pressable>
          <Pressable
            onPress={onOk}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent>
              <Text style={[styles.buttonText]}>OK</Text>
            </TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const Header = ({
  month,
  moveMonth,
  moveYear,
}: {
  month: Moment;
  moveMonth: (n: number) => void;
  moveYear: (n: number) => void;
}) => {
  const {theme} = useTheme();

  const [isVisible, setIsVisible] = useState(false);

  const updateVisibility = (visibility: boolean) => setIsVisible(visibility);

  return (
    <>
      {isVisible && (
        <YearAndMonthModal
          isVisible={isVisible}
          updateVisibility={updateVisibility}
          month={month}
          moveMonth={moveMonth}
          moveYear={moveYear}
        />
      )}
      <HorizontalMover
        onLeftPress={() => moveMonth(-1)}
        onRightPress={() => moveMonth(1)}
        onCenterPress={() => updateVisibility(true)}>
        <>
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
        </>
      </HorizontalMover>
    </>
  );
};

const Grid = ({
  month,
  selectedDate,
  updateCurrentDate,
  startDate,
}: {
  month: Moment;
  selectedDate?: Moment;
  updateCurrentDate: (date: Moment) => void;
  startDate?: Moment;
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
        startDate={startDate}
      />
    </>
  );
};

const Days = ({
  month,
  selectedDate,
  updateCurrentDate,
  startDate: startDateProp,
}: {
  month: Moment;
  selectedDate?: Moment;
  updateCurrentDate: (date: Moment) => void;
  startDate?: Moment;
}) => {
  const {theme} = useTheme();

  const Item = useCallback(
    ({day}: {day: Moment}) => {
      const isDisabled = startDateProp ? day.isBefore(startDateProp) : false;
      const backgroundColor = selectedDate?.isSame(day)
        ? theme.colors.primary[100]
        : theme.colors.surface[200];
      const opacity = day.month() === month.month() && !isDisabled ? 1 : 0.25;
      const fontFamily = selectedDate?.isSame(day)
        ? 'Inter-Bold'
        : 'Inter-Regular';

      return (
        <Pressable
          disabled={isDisabled || day.month() !== month.month()}
          style={[styles.dayItem, {backgroundColor, opacity}]}
          onPress={() => updateCurrentDate(day)}>
          <TextContent>
            <Text style={[{fontFamily}]}>{day.format('DD')}</Text>
          </TextContent>
        </Pressable>
      );
    },
    [theme, month, selectedDate, updateCurrentDate, startDateProp],
  );

  const startDate = moment(month).subtract(month.weekday(), 'days');
  const daysList: JSX.Element[][] = [];
  const total = 6 * 7;

  for (let i = 0; i < total; i++) {
    const y = Math.floor(i / 7);

    if (!daysList[y]) daysList[y] = [];

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

interface IHorizontalMover {
  onLeftPress: () => void;
  onRightPress: () => void;
  onCenterPress?: () => void;
  children: JSX.Element;
}

const HorizontalMover = ({
  onLeftPress,
  onRightPress,
  onCenterPress = () => {},
  children,
}: IHorizontalMover) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.header]}>
      <Pressable onPress={onLeftPress}>
        <MaterialCommunityIcons
          name="chevron-left"
          color={theme.colors.primary[100]}
          size={32}
        />
      </Pressable>
      <Pressable
        onPress={onCenterPress}
        style={[styles.headerMonthAndYearContainer]}>
        {children}
      </Pressable>
      <Pressable onPress={onRightPress}>
        <MaterialCommunityIcons
          name="chevron-right"
          color={theme.colors.primary[100]}
          size={32}
        />
      </Pressable>
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
  yearSelector: {
    width: '100%',
    flexDirection: 'column',
    borderRadius: 20,
    padding: 16,
    rowGap: 20,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 12,
  },
  yearSelectorHead: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 16,
  },
  yearSelectorHeadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  yearAndMonthModalContainer: {
    borderRadius: 20,
  },
});
