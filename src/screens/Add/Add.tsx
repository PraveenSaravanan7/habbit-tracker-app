import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigator} from '../../../NavigationUtils';
import {SelectCategory} from './SelectCategory';
import {ICategory} from '../../database/models/category';
import {SelectHabitType} from './SelectHabitType';
import {
  COMPARISON_TYPE,
  HABIT_TYPES,
  REPEAT_TYPE,
  THabit,
} from '../../database/models/habit';
import {Description} from './Description';
import {SelectRepetition} from './SelectRepetition';
import {SelectStartDate} from './SelectStartDate';

enum SCREENS {
  SELECT_CATEGORY = 1,
  SELECT_HABIT_TYPE,
  DEFINE,
  SELECT_REPEAT_CONFIG,
  SELECT_START_DATE,
}

export const Add = () => {
  const {theme} = useTheme();
  const {goBack} = useNavigator();
  const insets = useSafeAreaInsets();

  const backgroundColor = theme.colors.surface[100];

  const [activeScreen, setActiveScreen] = useState(SCREENS.SELECT_CATEGORY);

  const [category, setCategory] = useState<ICategory>();
  const [habitType, setHabitType] = useState<HABIT_TYPES>(
    HABIT_TYPES.YES_OR_NO,
  );
  const [nameTextInput, setNameTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<number>();
  const [unit, setUnit] = useState<string>('');
  const [compare, setCompare] = useState<COMPARISON_TYPE>(
    COMPARISON_TYPE.AT_LEAST,
  );
  const [repeatConfig, setRepeatConfig] = useState<THabit['repeatConfig']>({
    repeatType: REPEAT_TYPE.EVERY_DAY,
    days: undefined,
  });

  const updateName = (name: string) => setNameTextInput(name);
  const updateDescription = (val: string) => setDescription(val);
  const updateGoal = (val: number) => setGoal(val);
  const updateUnit = (val: string) => setUnit(val);
  const updateCompare = (val: COMPARISON_TYPE) => setCompare(val);
  const updateRepeatConfig = (val: THabit['repeatConfig']) =>
    setRepeatConfig(val);

  const onSelectCategory = (selectedCategory: ICategory) => {
    setCategory(selectedCategory);
    onNext();
  };

  const onSelectHabitType = (selectedHabitType: HABIT_TYPES) => {
    setHabitType(selectedHabitType);
    onNext();
  };

  const onSave = () => {};

  const onBack = () => {
    switch (activeScreen) {
      case SCREENS.SELECT_CATEGORY:
        goBack();
        break;

      case SCREENS.SELECT_HABIT_TYPE:
        setHabitType(undefined);
        setActiveScreen(SCREENS.SELECT_CATEGORY);
        break;

      case SCREENS.DEFINE:
        setNameTextInput('');
        setDescription('');
        setGoal(undefined);
        setUnit('');
        setCompare(COMPARISON_TYPE.AT_LEAST);
        setActiveScreen(SCREENS.SELECT_HABIT_TYPE);
        break;

      case SCREENS.SELECT_REPEAT_CONFIG:
        setRepeatConfig({
          repeatType: REPEAT_TYPE.EVERY_DAY,
          days: undefined,
        });
        setActiveScreen(SCREENS.DEFINE);
        break;

      case SCREENS.SELECT_START_DATE:
        setActiveScreen(SCREENS.SELECT_REPEAT_CONFIG);
        break;
    }
  };

  const onNext = () => {
    switch (activeScreen) {
      case SCREENS.SELECT_CATEGORY:
        setActiveScreen(SCREENS.SELECT_HABIT_TYPE);
        break;

      case SCREENS.SELECT_HABIT_TYPE:
        setActiveScreen(SCREENS.DEFINE);
        break;

      case SCREENS.DEFINE:
        setActiveScreen(SCREENS.SELECT_REPEAT_CONFIG);
        break;

      case SCREENS.SELECT_REPEAT_CONFIG:
        setActiveScreen(SCREENS.SELECT_START_DATE);
        break;

      case SCREENS.SELECT_START_DATE:
        onSave();
        break;
    }
  };

  const showEmptyButton =
    activeScreen === SCREENS.SELECT_CATEGORY ||
    activeScreen === SCREENS.SELECT_HABIT_TYPE;

  return (
    <>
      <ScrollView style={[styles.container]}>
        {activeScreen === SCREENS.SELECT_CATEGORY && (
          <SelectCategory onSelectCategory={onSelectCategory} />
        )}
        {activeScreen === SCREENS.SELECT_HABIT_TYPE && (
          <SelectHabitType onSelectHabitType={onSelectHabitType} />
        )}
        {activeScreen === SCREENS.DEFINE && (
          <Description
            habitType={habitType}
            name={nameTextInput}
            updateName={updateName}
            description={description}
            updateDescription={updateDescription}
            goal={goal}
            updateGoal={updateGoal}
            unit={unit}
            updateUnit={updateUnit}
            compare={compare}
            updateCompare={updateCompare}
          />
        )}
        {activeScreen === SCREENS.SELECT_REPEAT_CONFIG && (
          <SelectRepetition
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
        )}
        {activeScreen === SCREENS.SELECT_START_DATE && <SelectStartDate />}
      </ScrollView>
      <View
        style={[
          styles.actionsContainer,
          {
            borderColor: theme.colors.surface[200],
            backgroundColor,
            paddingBottom: insets.bottom + 4,
          },
        ]}>
        <Pressable onPress={onBack} style={[styles.button]}>
          <TextContent>
            <Text style={[styles.buttonText]}>
              {activeScreen === SCREENS.SELECT_CATEGORY ? 'CANCEL' : 'BACK'}
            </Text>
          </TextContent>
        </Pressable>
        <View style={[styles.ringsContainer]}>
          {[1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[
                styles.ring,
                {borderColor: theme.colors.primary[100]},
                i < activeScreen && {
                  backgroundColor: theme.colors.primary[100],
                },
              ]}
            />
          ))}
        </View>
        {showEmptyButton ? (
          <View style={[styles.button]} />
        ) : (
          <Pressable onPress={onNext} style={[styles.button]}>
            <TextContent>
              <Text style={[styles.buttonText]}>
                {activeScreen === SCREENS.SELECT_START_DATE ? 'SAVE' : 'NEXT'}
              </Text>
            </TextContent>
          </Pressable>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 40, paddingBottom: 100},
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 4,
    bottom: 0,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  ring: {
    borderRadius: 100,
    height: 8,
    width: 8,
    borderWidth: 1,
  },
  ringsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 2,
  },
});
