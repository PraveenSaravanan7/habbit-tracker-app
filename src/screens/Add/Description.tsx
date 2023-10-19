import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {TextInput} from '../../components/TextInput';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {COMPARISON_TYPE, HABIT_TYPES} from '../../database/models/habit';
import {Select} from '../../components/Select';

interface IDescriptionProps {
  habitType: HABIT_TYPES;
  name: string;
  updateName: (val: string) => void;
  description: string;
  updateDescription: (val: string) => void;
  goal?: number;
  updateGoal: (val: number) => void;
  unit?: string;
  updateUnit: (val: string) => void;
  compare: COMPARISON_TYPE;
  updateCompare: (val: COMPARISON_TYPE) => void;
}

export const Description = ({
  habitType,
  compare,
  description,
  name,
  updateCompare,
  updateDescription,
  updateGoal,
  updateName,
  updateUnit,
  goal,
  unit,
}: IDescriptionProps) => {
  const {theme} = useTheme();

  const exampleText = (() => {
    if (HABIT_TYPES.NUMERIC === habitType)
      return 'eg: Study for the exam. At least 2 chapter a day.';

    if (HABIT_TYPES.TIMER === habitType)
      return 'eg: Study for the exam. At least 30 minutes a day.';

    return 'eg: Study for the exam.';
  })();

  return (
    <View style={[styles.wrapper]}>
      <Title title="Define your habit" />
      <View style={styles.container}>
        <TextInput
          label="Habit"
          onChangeText={updateName}
          value={name}
          placeholder=""
        />
        {habitType === HABIT_TYPES.NUMERIC && (
          <NumericOptions
            compare={compare}
            goal={goal}
            unit={unit}
            updateCompare={updateCompare}
            updateGoal={updateGoal}
            updateUnit={updateUnit}
          />
        )}
        <View>
          <TextContent
            style={[{color: theme.colors.disabledText}, styles.egText]}>
            {exampleText}
          </TextContent>
        </View>
        <TextInput
          label="Description (Optional)"
          onChangeText={updateDescription}
          value={description}
          placeholder=""
        />
      </View>
    </View>
  );
};

interface INumericOptionsProps {
  compare: COMPARISON_TYPE;
  updateCompare: (compare: COMPARISON_TYPE) => void;
  goal?: number;
  updateGoal: (goal: number) => void;
  unit?: string;
  updateUnit: (unit: string) => void;
}

const NumericOptions = ({
  compare,
  goal,
  unit,
  updateCompare,
  updateGoal,
  updateUnit,
}: INumericOptionsProps) => (
  <>
    <View style={[styles.items]}>
      <Select
        flex={1}
        onSelect={val => updateCompare(val as COMPARISON_TYPE)}
        value={compare}
        list={Object.values(COMPARISON_TYPE)}
      />
      <TextInput
        flex={1}
        label="Goal"
        onChangeText={number => updateGoal(+number)}
        value={goal?.toString()}
        keyboardType="number-pad"
      />
    </View>
    <View style={[styles.items]}>
      <TextInput
        flex={1}
        label="Unit (optional)"
        onChangeText={string => updateUnit(string)}
        value={unit}
      />
      <View style={styles.unitText}>
        <TextContent>a day.</TextContent>
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  wrapper: {paddingHorizontal: 8, paddingBottom: 200},
  container: {rowGap: 20},
  egText: {textAlign: 'center', fontSize: 12, fontFamily: 'Inter-Medium'},
  items: {flexDirection: 'row', width: '100%', columnGap: 16},
  unitText: {flex: 1, justifyContent: 'center'},
});
