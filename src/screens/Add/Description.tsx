import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {TextInput} from '../../components/TextInput';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {HABIT_TYPES} from '../../database/models/habit';
import {Select} from '../../components/Select';

interface IDescriptionProps {
  habitType: HABIT_TYPES;
}

enum COMPARE {
  AT_LEAST = 'At least',
  LESS_THAN = 'Less than',
  EXACTLY = 'Exactly',
  ANY_VALUE = 'Any value',
}

export const Description = ({habitType}: IDescriptionProps) => {
  const {theme} = useTheme();

  const [nameTextInput, setNameTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<number>();
  const [unit, setUnit] = useState<string>();
  const [compare, setCompare] = useState<COMPARE>(COMPARE.AT_LEAST);

  const updateName = (name: string) => setNameTextInput(name);
  const updateDescription = (name: string) => setDescription(name);

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
          value={nameTextInput}
          placeholder=""
        />
        {habitType === HABIT_TYPES.NUMERIC && (
          <NumericOptions
            compare={compare}
            goal={goal}
            unit={unit}
            updateCompare={val => setCompare(val)}
            updateGoal={val => setGoal(val)}
            updateUnit={val => setUnit(val)}
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
  compare: COMPARE;
  updateCompare: (compare: COMPARE) => void;
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
        onSelect={val => updateCompare(val as COMPARE)}
        value={compare}
        list={Object.values(COMPARE)}
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
