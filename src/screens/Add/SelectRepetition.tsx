import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {REPEAT_TYPE, THabit} from '../../database/models/habit';
import {Radio} from '../../components/Radio';
import {TextContent} from '../../components/TextContent';

interface ISelectRepetitionProps {
  repeatConfig: THabit['repeatConfig'];
  updateRepeatConfig: (val: THabit['repeatConfig']) => void;
}

export const SelectRepetition = ({
  repeatConfig,
  updateRepeatConfig,
}: ISelectRepetitionProps) => {
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
});
