import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigator, useRouter} from '../../../NavigationUtils';
import {SelectCategory} from './SelectCategory';
import {ICategory} from '../../database/models/category';
import {SelectHabitType} from './SelectHabitType';
import getHabitModel, {
  COMPARISON_TYPE,
  HABIT_TYPES,
  REPEAT_TYPE,
  THabit,
} from '../../database/models/habit';
import {Description} from './Description';
import {SelectRepetition} from './SelectRepetition';
import {SelectStartDate} from './SelectStartDate';
import moment from 'moment';
import {HABIT_MODEL_EVENT, emitDatabaseEvent} from '../../database/database';
import {v4 as uuid} from 'uuid';
import {ConfirmationModal} from '../components/ConfirmationModal';
import {commonColors} from '../../../themes';

enum SCREENS {
  SELECT_CATEGORY = 1,
  SELECT_HABIT_TYPE,
  DEFINE,
  SELECT_REPEAT_CONFIG,
  SELECT_START_DATE,
}

export const Add = () => {
  const {theme} = useTheme();
  const {
    addListener: addNavigationListener,
    dispatch: dispatchNavigation,
    goBack,
  } = useNavigator();
  const {
    params: {isTask},
  } = useRouter<'Add'>();

  const insets = useSafeAreaInsets();

  const backgroundColor = theme.colors.surface[100];
  const defaultGoalTime = '00:00:00';

  const [activeScreen, setActiveScreen] = useState(SCREENS.SELECT_CATEGORY);

  const [category, setCategory] = useState<ICategory>();
  const [habitType, setHabitType] = useState<HABIT_TYPES>(
    HABIT_TYPES.YES_OR_NO,
  );
  const [nameTextInput, setNameTextInput] = useState('');
  const [description, setDescription] = useState('');
  const [checkList, setCheckList] = useState<string[]>([]);
  const [goal, setGoal] = useState<number>();
  const [goalTime, setGoalTime] = useState(defaultGoalTime);
  const [unit, setUnit] = useState<string>('');
  const [compare, setCompare] = useState<COMPARISON_TYPE>(
    COMPARISON_TYPE.AT_LEAST,
  );
  const [repeatConfig, setRepeatConfig] = useState<THabit['repeatConfig']>({
    repeatType: isTask ? REPEAT_TYPE.NO_REPEAT : REPEAT_TYPE.EVERY_DAY,
    days: undefined,
  });
  const [startDate, setStartDate] = useState(
    moment().format('DD/MM/YYYY').toString(),
  );
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [discardModal, setDiscardModal] = useState<any>();

  const skipDiscardModel = useRef<boolean>();

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

  const onSave = () => {
    const habitModel = getHabitModel();
    const habit: THabit = {
      id: uuid(),
      habitName: nameTextInput,
      habitDescription: description,
      habitType: habitType,
      repeatConfig,
      category: category?.id || '',
      startDate,
      priority,
      endDate:
        repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT ? startDate : endDate,
      isTask,
    };

    if (habit.habitType === HABIT_TYPES.NUMERIC)
      habit.habitConfig = {
        comparisonType: compare,
        goalNumber: goal || 1,
        unitName: unit,
      };
    else if (habit.habitType === HABIT_TYPES.TIMER)
      habit.habitConfig = {comparisonType: compare, duration: goalTime};
    else if (habit.habitType === HABIT_TYPES.CHECKLIST)
      habit.habitConfig = {checkList};

    habitModel.insertOne(habit);

    console.log('-- Added habit ', habit);

    emitDatabaseEvent(HABIT_MODEL_EVENT.ADD_HABIT); // TODO: Maybe add data arg as well

    skipDiscardModel.current = true;

    goBack();
  };

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
        setStartDate(moment().format('DD/MM/YYYY').toString());
        setEndDate('');
        setPriority(1);
        setActiveScreen(SCREENS.SELECT_REPEAT_CONFIG);
        break;
    }
  };

  const isInValidateStep = () => {
    switch (activeScreen) {
      case SCREENS.DEFINE:
        if (!nameTextInput)
          return `Please enter valid ${isTask ? 'task' : 'habit'}`;
        if (habitType === HABIT_TYPES.NUMERIC && !goal)
          return 'Please enter valid goal';
        if (habitType === HABIT_TYPES.TIMER && goalTime === defaultGoalTime)
          return 'Please enter valid time';
        if (habitType === HABIT_TYPES.CHECKLIST && checkList.length === 0)
          return 'Please add valid check lists';
        break;

      case SCREENS.SELECT_REPEAT_CONFIG:
        if (
          repeatConfig.repeatType !== REPEAT_TYPE.NO_REPEAT &&
          repeatConfig.repeatType !== REPEAT_TYPE.EVERY_DAY &&
          repeatConfig.days.length === 0
        )
          return 'Please select days';
        break;
    }
  };

  const onNext = () => {
    const errorMessage = isInValidateStep();

    if (errorMessage)
      return ToastAndroid.showWithGravity(
        errorMessage,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );

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

  useEffect(() => {
    addNavigationListener('beforeRemove', e => {
      if (skipDiscardModel.current) return;

      e.preventDefault();

      setDiscardModal(e);
    });
  }, [addNavigationListener, skipDiscardModel]);

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={[styles.container]}>
        {activeScreen === SCREENS.SELECT_CATEGORY && (
          <SelectCategory onSelectCategory={onSelectCategory} isTask={isTask} />
        )}
        {activeScreen === SCREENS.SELECT_HABIT_TYPE && (
          <SelectHabitType
            onSelectHabitType={onSelectHabitType}
            isTask={isTask}
          />
        )}
        {activeScreen === SCREENS.DEFINE && (
          <Description
            isTask={isTask}
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
            isTask={isTask}
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
        )}
        {activeScreen === SCREENS.SELECT_START_DATE && (
          <SelectStartDate
            noRepeat={repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT}
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
      <ConfirmationModal
        text={`Discard the new ${isTask ? 'task' : 'habit'}?`}
        color={commonColors.red}
        isOpen={Boolean(discardModal)}
        onCancel={() => setDiscardModal(undefined)}
        onOk={() => {
          dispatchNavigation(discardModal.data.action);
          setDiscardModal(undefined);
        }}
      />
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
