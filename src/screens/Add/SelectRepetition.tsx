import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {
  DAY_OF_THE_MONTH,
  DAY_OF_THE_WEEK,
  REPEAT_TYPE,
  THabit,
} from '../../database/models/habit';
import {Radio} from '../../components/Radio';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';

interface ISelectRepetitionProps {
  repeatConfig: THabit['repeatConfig'];
  updateRepeatConfig: (val: THabit['repeatConfig']) => void;
}

export const SelectRepetition = ({
  repeatConfig,
  updateRepeatConfig,
}: ISelectRepetitionProps) => {
  const {theme} = useTheme();

  const addOrRemoveDay = (day: DAY_OF_THE_MONTH | DAY_OF_THE_WEEK) => {
    if (
      repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK ||
      repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH
    )
      updateRepeatConfig({
        ...repeatConfig,
        days: repeatConfig.days.includes(day as never)
          ? [...repeatConfig.days].filter(x => x !== day)
          : [...repeatConfig.days, day as any],
      });
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const DayList = () => (
    <View style={[styles.listContainer]}>
      {Object.values(
        repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK
          ? DAY_OF_THE_WEEK
          : DAY_OF_THE_MONTH,
      ).map(key => {
        return (
          <Pressable
            onPress={() => addOrRemoveDay(key)}
            style={[
              styles.listItem,
              {
                backgroundColor: repeatConfig.days?.includes(key as never)
                  ? theme.colors.primary[100]
                  : theme.colors.surface[200],
              },
            ]}>
            <TextContent style={[styles.listItemText]}>{key}</TextContent>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.wrapper]}>
      <Title title="How often do you want to do it?" />
      <View style={[styles.container]}>
        <Pressable
          style={[styles.item]}
          onPress={() =>
            updateRepeatConfig({
              repeatType: REPEAT_TYPE.EVERY_DAY,
              days: undefined,
            })
          }>
          <Radio
            size={20}
            selected={repeatConfig.repeatType === REPEAT_TYPE.EVERY_DAY}
          />
          <TextContent style={styles.itemText}>Every day</TextContent>
        </Pressable>

        <Pressable
          style={[styles.item]}
          onPress={() =>
            updateRepeatConfig({
              repeatType: REPEAT_TYPE.DAY_OF_THE_WEEK,
              days: [],
            })
          }>
          <Radio
            size={20}
            selected={repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK}
          />
          <TextContent style={styles.itemText}>
            Specific days of the week
          </TextContent>
        </Pressable>

        {repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK && <DayList />}

        <Pressable
          style={[styles.item]}
          onPress={() =>
            updateRepeatConfig({
              repeatType: REPEAT_TYPE.DAY_OF_THE_MONTH,
              days: [],
            })
          }>
          <Radio
            size={20}
            selected={repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH}
          />
          <TextContent style={styles.itemText}>
            Specific days of the month
          </TextContent>
        </Pressable>

        {repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_MONTH && (
          <DayList />
        )}

        <Pressable
          style={[styles.item]}
          onPress={() =>
            updateRepeatConfig({
              repeatType: REPEAT_TYPE.DAY_OF_THE_YEAR,
              days: [],
            })
          }>
          <Radio
            size={20}
            selected={repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR}
          />
          <TextContent style={styles.itemText}>
            Specific days of the year
          </TextContent>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {paddingHorizontal: 8, paddingBottom: 200},
  container: {rowGap: 24},
  item: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  itemText: {fontSize: 16, fontFamily: 'Inter-Medium'},
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 16,
    paddingHorizontal: 32,
  },
  listItem: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
