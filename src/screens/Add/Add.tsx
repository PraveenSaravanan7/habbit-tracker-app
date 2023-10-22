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
import moment from 'moment';

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
  const [checkList, setCheckList] = useState<string[]>([]);
  const [goal, setGoal] = useState<number>();
  const [goalTime, setGoalTime] = useState('00:00:00');
  const [unit, setUnit] = useState<string>('');
  const [compare, setCompare] = useState<COMPARISON_TYPE>(
    COMPARISON_TYPE.AT_LEAST,
  );
  const [repeatConfig, setRepeatConfig] = useState<THabit['repeatConfig']>({
    repeatType: REPEAT_TYPE.EVERY_DAY,
    days: undefined,
  });
  const [startDate, setStartDate] = useState(
    moment().format('DD/MM/YY').toString(),
  );
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState(1);

  const updateName = (name: string) => setNameTextInput(name);
  const updateDescription = (val: string) => setDescription(val);
  const updateGoal = (val: number) => setGoal(val);
  const updateGoalTime = (val: string) => setGoalTime(val);
  const updateUnit = (val: string) => setUnit(val);
  const updateCompare = (val: COMPARISON_TYPE) => setCompare(val);
  const updateRepeatConfig = (val: THabit['repeatConfig']) =>
    setRepeatConfig(val);
  const updateStartDate = (date: string) => setStartDate(date);
  const updateEndDate = (date: string) => setEndDate(date);
  const updatePriority = (val: number) => setPriority(val);
  const updateCheckList = (val: string[]) => setCheckList(val);

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
        setHabitType(HABIT_TYPES.YES_OR_NO);
        setActiveScreen(SCREENS.SELECT_CATEGORY);
        break;

      case SCREENS.DEFINE:
        setNameTextInput('');
        setDescription('');
        setGoal(undefined);
        setGoalTime('00:00:00');
        setUnit('');
        setCompare(COMPARISON_TYPE.AT_LEAST);
        setActiveScreen(SCREENS.SELECT_HABIT_TYPE);
        setCheckList([]);
        break;

      case SCREENS.SELECT_REPEAT_CONFIG:
        setRepeatConfig({
          repeatType: REPEAT_TYPE.EVERY_DAY,
          days: undefined,
        });
        setActiveScreen(SCREENS.DEFINE);
        break;

      case SCREENS.SELECT_START_DATE:
        setStartDate(moment().format('DD/MM/YY').toString());
        setEndDate('');
        setPriority(1);
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
            goalTime={goalTime}
            updateGoalTime={updateGoalTime}
            checkList={checkList}
            updateCheckList={updateCheckList}
          />
        )}
        {activeScreen === SCREENS.SELECT_REPEAT_CONFIG && (
          <SelectRepetition
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
        )}
        {activeScreen === SCREENS.SELECT_START_DATE && (
          <SelectStartDate
            startDate={startDate}
            endDate={endDate}
            priority={priority}
            updateEndDate={updateEndDate}
            updatePriority={updatePriority}
            updateStartDate={updateStartDate}
          />
        )}
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
              <Text
                style={[
                  styles.buttonText,
                  activeScreen === SCREENS.SELECT_START_DATE && {
                    color: theme.colors.primary[100],
                  },
                ]}>
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
