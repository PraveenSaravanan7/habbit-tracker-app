import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {TextInput} from '../../components/TextInput';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {COMPARISON_TYPE, HABIT_TYPES} from '../../database/models/habit';
import {Select} from '../../components/Select';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from '../../components/Modal';

/**
 * TODO:
 * 1. Selection timer fix
 */

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
  goalTime: string;
  updateGoalTime: (val: string) => void;
  checkList: string[];
  updateCheckList: (val: string[]) => void;
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
  goalTime,
  updateGoalTime,
  checkList,
  updateCheckList,
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

        {habitType === HABIT_TYPES.TIMER && (
          <TimerOptions
            compare={compare}
            goalTime={goalTime}
            updateCompare={updateCompare}
            updateGoalTime={updateGoalTime}
          />
        )}

        {habitType === HABIT_TYPES.CHECKLIST && (
          <CheckList checkList={checkList} updateCheckList={updateCheckList} />
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

interface ICheckListProps {
  checkList: string[];
  updateCheckList: (val: string[]) => void;
}

const CheckList = ({checkList, updateCheckList}: ICheckListProps) => {
  const {theme} = useTheme();

  const [openModal, setOpenModal] = useState(false);

  const [editItem, setEditItem] = useState<number | null>(null);

  const addList = (name: string) => {
    updateCheckList([...checkList, name]);
  };

  const editText = (name: string) => {
    if (editItem === null) return;

    const copy = [...checkList];
    copy[editItem] = name;
    updateCheckList(copy);
    setEditItem(null);
  };

  const deleteList = (index: number) => {
    updateCheckList(
      checkList.slice(0, index).concat(checkList.slice(index + 1)),
    );
  };

  return (
    <View style={[styles.dateListContainer]}>
      <View style={[styles.dateContainer]}>
        {checkList?.length ? (
          <View
            style={[
              styles.dateList,
              {backgroundColor: theme.colors.surface[200]},
            ]}>
            {checkList.map((val, index) => (
              <Pressable
                key={val}
                style={[styles.dateListItem]}
                onPress={() => {
                  setEditItem(index);
                  setOpenModal(true);
                }}>
                <TextContent style={styles.dateItemText}>{`${
                  index + 1
                }. ${val}`}</TextContent>
                <Pressable onPress={() => deleteList(index)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    style={{color: theme.colors.text}}
                  />
                </Pressable>
              </Pressable>
            ))}
          </View>
        ) : (
          <Pressable
            onPress={() => setOpenModal(true)}
            style={[
              styles.emptyDateList,
              {backgroundColor: theme.colors.surface[200]},
            ]}>
            <TextContent>Select at least one day</TextContent>
          </Pressable>
        )}
      </View>

      <View>
        <Pressable
          onPress={() => setOpenModal(true)}
          style={[
            styles.addButton,
            {backgroundColor: theme.colors.primary[100]},
          ]}>
          <MaterialCommunityIcons
            name="plus"
            size={24}
            style={{color: theme.colors.text}}
          />
        </Pressable>
      </View>

      {openModal && (
        <EditCheckList
          isOpen={openModal}
          updateVisibility={visibility => {
            if (!visibility && editItem !== null) setEditItem(null);
            setOpenModal(visibility);
          }}
          updateName={editItem === null ? addList : editText}
          name={editItem !== null && editItem > -1 ? checkList[editItem] : ''}
        />
      )}
    </View>
  );
};

interface IEditCheckListProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateName: (name: string) => void;
  name: string;
}

const EditCheckList = ({
  isOpen,
  updateVisibility,
  updateName,
  name,
}: IEditCheckListProps) => {
  const {theme} = useTheme();

  const [listName, setListName] = useState(name);

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    updateName(listName);
    onClose();
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.nameTextInputContainer]}>
          <View>
            <TextInput
              label="Task"
              autoFocus={true}
              onChangeText={text => setListName(text)}
              value={name || listName}
              labelBackgroundColor={theme.colors.surface[100]}
            />
          </View>
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>CANCEL</TextContent>
          </Pressable>
          <Pressable
            onPress={onOk}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>OK</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface ITimerOptionsProps {
  compare: COMPARISON_TYPE;
  updateCompare: (compare: COMPARISON_TYPE) => void;
  goalTime: string;
  updateGoalTime: (goal: string) => void;
}

const TimerOptions = ({
  compare,
  goalTime,
  updateCompare,
  updateGoalTime,
}: ITimerOptionsProps) => {
  const [hours, minutes, seconds] = goalTime.split(':');

  return (
    <>
      <View style={[styles.items]}>
        <Select
          flex={1}
          onSelect={val => updateCompare(val as COMPARISON_TYPE)}
          value={compare}
          list={Object.values(COMPARISON_TYPE)}
        />
      </View>
      <View style={[styles.items]}>
        <TextInput
          flex={2}
          label="Hours"
          onChangeText={hours => {
            if (Number.isInteger(hours))
              updateGoalTime(`${hours.padStart(2, '0')}:${minutes}:${seconds}`);
          }}
          value={hours}
          keyboardType="number-pad"
        />
        <TextInput
          flex={2}
          label="Minutes"
          onChangeText={minutes => {
            if (Number.isInteger(minutes))
              updateGoalTime(`${hours}:${minutes.padStart(2, '0')}:${seconds}`);
          }}
          value={minutes}
          keyboardType="number-pad"
        />
        <TextInput
          flex={2}
          label="Seconds"
          onChangeText={seconds => {
            if (Number.isInteger(seconds))
              updateGoalTime(`${hours}:${minutes}:${seconds.padStart(2, '0')}`);
          }}
          value={seconds}
          keyboardType="number-pad"
        />
        <View style={styles.unitText}>
          <TextContent>a day.</TextContent>
        </View>
      </View>
    </>
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
  dateListContainer: {
    width: '100%',
    flexDirection: 'row',
    columnGap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dateContainer: {width: '80%', rowGap: 8},
  dateList: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    rowGap: 16,
  },
  dateListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyDateList: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
  containerEdit: {
    flexDirection: 'column',
    borderRadius: 20,
    maxHeight: 360,
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
    fontSize: 14,
  },
  nameTextInputContainer: {padding: 16, rowGap: 12},
});
