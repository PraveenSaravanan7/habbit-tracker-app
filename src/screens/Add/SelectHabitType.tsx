import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {HABIT_TYPES} from '../../database/models/habit';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';

interface ISelectHabitType {
  onSelectHabitType: (habitType: HABIT_TYPES) => void;
  isTask: boolean;
}

export const SelectHabitType = ({
  onSelectHabitType,
  isTask,
}: ISelectHabitType) => {
  const {theme} = useTheme();

  const backgroundColor = theme.colors.primary[100];
  const color = theme.colors.disabledText;

  const activity = isTask ? 'task' : 'habit';

  return (
    <View style={[styles.wrapper]}>
      <Title title="How do you want to evaluate your progress?" />
      <View style={[styles.container]}>
        <View style={[styles.item]}>
          <Pressable
            style={[styles.button, {backgroundColor}]}
            onPress={() => onSelectHabitType(HABIT_TYPES.YES_OR_NO)}>
            <TextContent style={[styles.buttonText]}>
              WITH A YES OR NO
            </TextContent>
          </Pressable>
          <TextContent style={[styles.description, {color}]}>
            If you just want to record whether you should succeed with the
            activity or not
          </TextContent>
        </View>

        <View style={[styles.item]}>
          <Pressable
            style={[styles.button, {backgroundColor}]}
            onPress={() => onSelectHabitType(HABIT_TYPES.NUMERIC)}>
            <TextContent style={[styles.buttonText]}>
              WITH A NUMERIC VALUE
            </TextContent>
          </Pressable>
          <TextContent style={[styles.description, {color}]}>
            If you just want to establish a value as a daily goal or limit for
            the {activity}
          </TextContent>
        </View>

        <View style={[styles.item]}>
          <Pressable
            style={[styles.button, {backgroundColor}]}
            onPress={() => onSelectHabitType(HABIT_TYPES.TIMER)}>
            <TextContent style={[styles.buttonText]}>WITH A TIMER</TextContent>
          </Pressable>
          <TextContent style={[styles.description, {color}]}>
            If you just want to establish a time value as a daily goal or limit
            for the {activity}
          </TextContent>
        </View>

        <View style={[styles.item]}>
          <Pressable
            style={[styles.button, {backgroundColor}]}
            onPress={() => onSelectHabitType(HABIT_TYPES.CHECKLIST)}>
            <TextContent style={[styles.buttonText]}>
              WITH A CHECKLIST
            </TextContent>
          </Pressable>
          <TextContent style={[styles.description, {color}]}>
            If you just want to evaluate your activity based on a set of
            sub-items
          </TextContent>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 8,
    paddingBottom: 200,
  },
  item: {
    width: '100%',
    rowGap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    rowGap: 24,
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    fontFamily: 'Inter-MediumI',
    textAlign: 'center',
  },
});
