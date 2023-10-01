import moment, {Moment} from 'moment';
import React, {useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';

export interface IDateRangeProps {
  currentDate: Moment;
  updateCurrentDate: (date: Moment) => void;
}

export const DateRange = ({
  currentDate,
  updateCurrentDate,
}: IDateRangeProps) => {
  const {theme} = useTheme();
  const dateList = useDateList({currentDate});
  const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <FlatList
      initialNumToRender={dateList.length}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={dateList}
      renderItem={({item: date, index}) => {
        const isActive = date.isSame(currentDate);
        const backgroundColor = isActive
          ? theme.colors.primary[100]
          : theme.colors.surface[300];
        const opacity = isActive ? 1 : 0.6;
        const fontFamily = isActive ? 'Inter-Bold' : 'Inter-Medium';

        return (
          <Pressable onPress={() => updateCurrentDate(date)} key={index}>
            <View style={[styles.item, {backgroundColor, opacity}]}>
              <TextContent>
                <Text
                  style={[
                    styles.dayText,
                    {color: theme.colors.text, fontFamily},
                  ]}>
                  {dayOfWeek[date.weekday()]}
                </Text>
              </TextContent>
              <TextContent>
                <Text
                  style={[
                    styles.dateText,
                    {color: theme.colors.text, fontFamily},
                  ]}>
                  {date.date()}
                </Text>
              </TextContent>
            </View>
          </Pressable>
        );
      }}
    />
  );
};

export const useDateList = ({currentDate}: {currentDate: Moment}) => {
  const getList = (date = moment().startOf('day')) => {
    const list: Moment[] = [];

    let range = 10;
    let x = -1 * range;

    while (x <= range) list.push(moment(date).startOf('day').add(x++, 'days'));

    return list;
  };

  const [dateList, setDateList] = useState(getList());

  if (!currentDate.isBetween(dateList.at(0), dateList.at(-1), 'day', '[]'))
    setDateList(getList(currentDate));

  return dateList;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginTop: 8,
    columnGap: 8,
    paddingLeft: 16,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 58,
    borderRadius: 18,
    borderColor: '#fff',
    opacity: 0.6,
    marginHorizontal: 4,
  },
  dateText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
  dayText: {
    fontSize: 10,
    color: '#fff',
    fontFamily: 'Inter-Bold',
  },
});
