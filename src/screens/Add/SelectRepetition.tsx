import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {
  DAY_OF_THE_MONTH,
  DAY_OF_THE_WEEK,
  MONTHS,
  REPEAT_TYPE,
  THabit,
} from '../../database/models/habit';
import {Radio} from '../../components/Radio';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Modal} from '../../components/Modal';
import {Select} from '../../components/Select';

/**
 * TODO
 * 1. Add End Date interval
 */

interface ISelectRepetitionProps {
  repeatConfig: THabit['repeatConfig'];
  updateRepeatConfig: (val: THabit['repeatConfig']) => void;
  isTask: boolean;
}

export const SelectRepetition = ({
  repeatConfig,
  updateRepeatConfig,
  isTask,
}: ISelectRepetitionProps) => {
  return (
    <View style={[styles.wrapper]}>
      <Title title="How often do you want to do it?" />
      <View style={[styles.container]}>
        {isTask && (
          <Pressable
            style={[styles.item]}
            onPress={() =>
              updateRepeatConfig({
                repeatType: REPEAT_TYPE.NO_REPEAT,
                days: undefined,
              })
            }>
            <Radio
              size={20}
              selected={repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT}
            />
            <TextContent style={styles.itemText}>No repetition</TextContent>
          </Pressable>
        )}

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

        {repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK && (
          <DayList
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
        )}

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
          <DayList
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
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

        {repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR && (
          <DateList
            repeatConfig={repeatConfig}
            updateRepeatConfig={updateRepeatConfig}
          />
        )}
      </View>
    </View>
  );
};

const DayList = ({
  repeatConfig,
  updateRepeatConfig,
}: Omit<ISelectRepetitionProps, 'isTask'>) => {
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

  return (
    <View style={[styles.listContainer]}>
      {Object.values(
        repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_WEEK
          ? DAY_OF_THE_WEEK
          : DAY_OF_THE_MONTH,
      ).map(key => {
        return (
          <Pressable
            key={key}
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
};

const DateList = ({
  repeatConfig,
  updateRepeatConfig,
}: Omit<ISelectRepetitionProps, 'isTask'>) => {
  const {theme} = useTheme();

  const [openModal, setOpenModal] = useState(false);

  const removeDay = (day: string) => {
    if (repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR)
      updateRepeatConfig({
        ...repeatConfig,
        days: [...repeatConfig.days].filter(x => x !== day),
      });
  };

  const addDay = (day: string) => {
    if (
      repeatConfig.repeatType === REPEAT_TYPE.DAY_OF_THE_YEAR &&
      !repeatConfig.days.includes(day)
    )
      updateRepeatConfig({
        ...repeatConfig,
        days: [...repeatConfig.days, day as any],
      });
  };

  return (
    <View style={[styles.dateListContainer]}>
      <View style={[styles.dateContainer]}>
        {repeatConfig.days?.length ? (
          <View
            style={[
              styles.dateList,
              {backgroundColor: theme.colors.surface[200]},
            ]}>
            {repeatConfig.days.map(val => (
              <View key={val} style={[styles.dateListItem]}>
                <TextContent style={styles.dateItemText}>{val}</TextContent>
                <Pressable onPress={() => removeDay(val)}>
                  <MaterialCommunityIcons
                    name="close"
                    size={18}
                    style={{color: theme.colors.text}}
                  />
                </Pressable>
              </View>
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

      <AddDay
        isOpen={openModal}
        updateVisibility={visibility => setOpenModal(visibility)}
        addDay={addDay}
      />
    </View>
  );
};

interface IAddDayProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  addDay: (name: string) => void;
}

const AddDay = ({isOpen, updateVisibility, addDay}: IAddDayProps) => {
  const {theme} = useTheme();

  const [month, setMonth] = useState(MONTHS.January);
  const [day, setDay] = useState(DAY_OF_THE_MONTH.ONE);

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    addDay(`${month} ${day}`);
    onClose();
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.dayInputContainer]}>
          <Select
            list={[...Object.values(MONTHS)]}
            onSelect={val => setMonth(val as MONTHS)}
            value={month}
            flex={1}
          />
          <Select
            list={Object.values(DAY_OF_THE_MONTH).slice(0, 30)}
            onSelect={val => setDay(val as DAY_OF_THE_MONTH)}
            value={day}
            flex={1}
          />
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.actionButtonText]}>CANCEL</TextContent>
          </Pressable>
          <Pressable
            onPress={onOk}
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.actionButtonText]}>OK</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    columnGap: 12,
    rowGap: 12,
    paddingHorizontal: 8,
  },
  listItem: {
    width: 38,
    height: 38,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
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
  emptyDateList: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
  dateList: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    rowGap: 16,
  },
  dateContainer: {width: '70%', rowGap: 8},
  containerEdit: {
    flexDirection: 'column',
    borderRadius: 20,
    maxHeight: 360,
  },
  nameTextInputContainer: {padding: 16, rowGap: 12},
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  actionButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
  dayInputContainer: {flexDirection: 'row', padding: 16, columnGap: 16},
  dateListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});
