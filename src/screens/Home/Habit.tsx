import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Pressable, StyleSheet, ToastAndroid, View} from 'react-native';
import getHabitModel, {REPEAT_TYPE, THabit} from '../../database/models/habit';
import {TextContent} from '../../components/TextContent';
import database, {
  HABIT_MODEL_EVENT,
  HISTORY_MODEL_EVENT,
} from '../../database/database';
import {useTheme} from '../../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {
  DAY_COLOR,
  convertHexToRGBA,
  getDayColorAndIsDisabled,
  getRepeatText,
} from '../../utils';
import moment, {Moment} from 'moment';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import getHistoryModel, {IHistory} from '../../database/models/history';
import {useNavigator} from '../../../NavigationUtils';
import {HABIT_INFO_TAB} from '../HabitInfo/HabitInfo';
import {CategoryIcon} from '../components/CategoryIcon';
import {commonColors} from '../../../themes';
import {Modal} from '../../components/Modal';
import {ConfirmationModal} from '../components/ConfirmationModal';
import {ProgressButton} from '../components/ProgressButtom';
import {Header} from '../../components/Header';

interface IHabitProps {
  tasksMode: boolean;
}

enum TABS {
  TODO = 'Todo',
  COMPLETED = 'Completed',
}

export const Habit = ({tasksMode}: IHabitProps) => {
  const {theme} = useTheme();
  const {HabitProgressModels, updateProgress} = useHabitUpdate();

  const [habits, setHabits] = useState<THabit[]>([]);
  const [categories] = useState<ICategory[]>(() => getCategoryModel().find());
  const [history, setHistory] = useState<IHistory[]>([]);
  const [activeHabit, setActiveHabit] = useState<THabit>();
  const [activeTab, setActiveTab] = useState<TABS>(TABS.TODO);

  const getCategory = (habit: THabit) =>
    categories.find(category => category.id === habit.category);

  const days = useMemo(() => {
    const list: Moment[] = [];
    let i = -7;

    while (i++) list.push(moment().add(i, 'days').startOf('day'));

    return list;
  }, []);

  const updateHistory = useCallback(
    () =>
      setHistory(() =>
        JSON.parse(
          JSON.stringify(
            getHistoryModel().find({
              date: {$in: days.map(day => day.format('DD/MM/YYYY'))},
            }),
          ),
        ),
      ),
    [days],
  );

  const updateHabit = useCallback(
    () =>
      setHabits(() =>
        [...getHabitModel().find()]
          .filter(habit => {
            if (habit.archived) return false;

            if (!tasksMode) return !habit.isTask;

            // below is for taskMode
            if (!habit.isTask) return false;

            // below isTask is true
            if (habit.repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT) {
              if (activeTab === TABS.TODO)
                return habit?.isCompleted === undefined;
              if (activeTab === TABS.COMPLETED)
                return habit?.isCompleted !== undefined;
            }

            // below is repeating tasks
            if (habit.endDate) {
              const today = moment().startOf('day');
              const endDate = moment(habit.endDate, 'DD/MM/YYYY');

              return activeTab === TABS.TODO
                ? today.isSameOrBefore(endDate)
                : today.isAfter(endDate);
            }

            // below is repeating tasks without endDateI
            return activeTab === TABS.TODO;
          })
          .sort((a, b) => b.priority - a.priority),
      ),
    [activeTab, tasksMode],
  );

  const onDelete = (habit: THabit) => {
    getHabitModel().remove(habit?.$loki || 0);
    updateHabit();
  };

  const archive = (habit: THabit) => {
    habit.archived = true;

    getHabitModel().update(habit);
    updateHabit();

    ToastAndroid.showWithGravity(
      'Archived',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
  };

  useEffect(() => {
    updateHabit();

    database.addListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);
    database.addListener(HABIT_MODEL_EVENT.UPDATE_HABIT, updateHabit);
    database.addListener(HABIT_MODEL_EVENT.UPDATED_SINGLE_TASK, updateHabit);

    return () => {
      database.removeListener(HABIT_MODEL_EVENT.ADD_HABIT, updateHabit);
      database.removeListener(HABIT_MODEL_EVENT.UPDATE_HABIT, updateHabit);
      database.removeListener(
        HABIT_MODEL_EVENT.UPDATED_SINGLE_TASK,
        updateHabit,
      );
    };
  }, [updateHabit]);

  useEffect(() => {
    updateHistory();

    database.addListener(HISTORY_MODEL_EVENT.UPDATE_HISTORY, updateHistory);

    return () =>
      database.removeListener(
        HISTORY_MODEL_EVENT.UPDATE_HISTORY,
        updateHistory,
      );
  }, [updateHistory]);

  return (
    <>
      <View style={[styles.container]}>
        {tasksMode && (
          <Header.Tabs
            activeTab={activeTab}
            onSelectTab={tab => setActiveTab(tab as TABS)}
            tabs={Object.values(TABS)}
          />
        )}
        {habits.map((habit, key) => {
          const category = getCategory(habit);

          if (!category) return null;

          if (habit.repeatConfig.repeatType === REPEAT_TYPE.NO_REPEAT)
            return (
              <Pressable
                style={[
                  styles.item,
                  {backgroundColor: theme.colors.surface[100]},
                ]}
                key={key}>
                <Todo
                  habit={habit}
                  category={category}
                  progress={getHistoryModel()
                    .findOne({date: habit.startDate})
                    ?.habits.find(candidate => candidate.habitId === habit.id)}
                  onPress={() => setActiveHabit(habit)}
                  onProgressButtonPress={() =>
                    updateProgress(habit, moment(habit.startDate, 'DD/MM/YYYY'))
                  }
                />
              </Pressable>
            );

          return (
            <Pressable
              onPress={() => setActiveHabit(habit)}
              style={[
                styles.item,
                {backgroundColor: theme.colors.surface[100]},
              ]}
              key={key}>
              <Title
                habit={habit}
                category={category}
                repeatInfo={getRepeatText(habit) || ''}
              />
              <Days
                habit={habit}
                updateProgress={updateProgress}
                days={days}
                history={history}
              />
              <BottomMenu habit={habit} category={category} />
            </Pressable>
          );
        })}
      </View>
      <HabitProgressModels />
      {activeHabit && (
        <InfoModel
          repeatInfo={getRepeatText(activeHabit) || ''}
          habit={activeHabit}
          category={getCategory(activeHabit) as ICategory}
          onClose={() => setActiveHabit(undefined)}
          onDelete={onDelete}
          archive={archive}
        />
      )}
    </>
  );
};

interface ITodoProps {
  habit: THabit;
  category: ICategory;
  progress?: IHistory['habits'][0];
  onPress: () => void;
  onProgressButtonPress: () => void;
}

const Todo = ({
  habit,
  category,
  progress,
  onPress,
  onProgressButtonPress,
}: ITodoProps) => (
  <Pressable onPress={onPress} style={[styles.todoContainer]}>
    <CategoryIcon
      category={category}
      size={36}
      borderRadius={12}
      iconSize={22}
    />
    <View style={styles.habitNameContainer}>
      <TextContent
        numberOfLines={2}
        ellipsizeMode="tail"
        maxScreenWidth={0.6}
        style={[styles.habitName]}>
        {habit.habitName}
      </TextContent>
      <View
        style={[
          styles.label,
          {backgroundColor: convertHexToRGBA(category.color, 0.2)},
        ]}>
        <TextContent style={[styles.labelText, {color: category.color}]}>
          {moment(habit.startDate, 'DD/MM/YYYY').isSame(moment().startOf('d'))
            ? 'Today'
            : habit.startDate}
          {habit.priority > 1 ? (
            <>
              {` | ${habit.priority}`}
              <MaterialCommunityIcons
                name="flag-outline"
                color={category.color}
                size={10}
              />
            </>
          ) : null}
        </TextContent>
      </View>
    </View>
    <Pressable
      onPress={onProgressButtonPress}
      style={styles.progressButtonWrapper}>
      <ProgressButton
        currentDate={moment(habit.startDate, 'DD/MM/YYYY')}
        habit={habit}
        progress={progress}
      />
    </Pressable>
  </Pressable>
);

interface ITitleProps {
  habit: THabit;
  category: ICategory;
  repeatInfo: string;
}

const Title = ({habit, category, repeatInfo}: ITitleProps) => (
  <View style={[styles.itemTop]}>
    <View style={styles.habitNameContainer}>
      <TextContent
        numberOfLines={2}
        ellipsizeMode="tail"
        maxScreenWidth={0.8}
        style={[styles.habitName]}>
        {habit.habitName}
      </TextContent>
      <View
        style={[
          styles.label,
          {backgroundColor: convertHexToRGBA(category.color, 0.2)},
        ]}>
        <TextContent
          numberOfLines={1}
          ellipsizeMode="tail"
          maxScreenWidth={0.6}
          style={[styles.labelText, {color: category.color}]}>
          {repeatInfo}
          {habit.priority > 1 ? (
            <>
              {` | ${habit.priority}`}
              <MaterialCommunityIcons
                name="flag-outline"
                color={category.color}
                size={10}
              />
            </>
          ) : null}
        </TextContent>
      </View>
    </View>

    <CategoryIcon
      category={category}
      size={36}
      borderRadius={12}
      iconSize={22}
    />
  </View>
);

interface IBottomMenuProps {
  habit: THabit;
  category: ICategory;
}

const BottomMenu = ({category, habit}: IBottomMenuProps) => {
  const {theme} = useTheme();
  const {navigate} = useNavigator();

  return (
    <View style={[styles.itemBottom, {borderColor: theme.colors.surface[200]}]}>
      <View style={[styles.itemBottomPart]}>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="link-variant"
            size={18}
            color={category.color}
          />
          <TextContent style={styles.bottomMenuItemText}>
            {habit.analytics.streaks}
          </TextContent>
        </View>
        {/* <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={18}
            color={category.color}
          />
          <TextContent style={styles.bottomMenuItemText}>
            {habit.analytics.completedDays}%
          </TextContent>
        </View> */}
      </View>
      <View style={[styles.itemBottomPart2]}>
        <Pressable
          style={[styles.bottomMenuItem]}
          onPress={() =>
            navigate('HabitInfo', {
              category,
              habit,
              tab: HABIT_INFO_TAB.CALENDAR,
            })
          }>
          <MaterialCommunityIcons
            name="calendar-outline"
            size={24}
            color={theme.colors.surface[600]}
          />
        </Pressable>
        <Pressable
          onPress={() =>
            navigate('HabitInfo', {
              category,
              habit,
              tab: HABIT_INFO_TAB.STATS,
            })
          }
          style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="chart-line"
            size={24}
            color={theme.colors.surface[600]}
          />
        </Pressable>
        <View style={[styles.bottomMenuItem]}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color={theme.colors.surface[600]}
          />
        </View>
      </View>
    </View>
  );
};

interface IDaysProps {
  habit: THabit;
  updateProgress: (habit: THabit, date: moment.Moment) => void;
  days: Moment[];
  history: IHistory[];
}

const Days = ({habit, updateProgress, days, history}: IDaysProps) => {
  const {theme} = useTheme();

  const colorMap: Record<DAY_COLOR, string[]> = {
    [DAY_COLOR.COMPLETED]: [commonColors.green],
    [DAY_COLOR.DISABLED]: [theme.colors.surface[200]],
    [DAY_COLOR.IN_COMPLETE]: [commonColors.red],
    [DAY_COLOR.IN_PROGRESS]: [commonColors.orange],
    [DAY_COLOR.NO_PROGRESS]: [theme.colors.surface[500]],
    [DAY_COLOR.NO_PROGRESS_OLD]: [commonColors.orange],
  };

  return (
    <View style={[styles.daysContainer]}>
      {days.map((day, index) => {
        const {disabled, color} = getDayColorAndIsDisabled(
          day,
          habit,
          colorMap,
          history,
        );
        const opacity = disabled ? 0.4 : 1;

        return (
          <Pressable
            onPress={() => updateProgress(habit, day)}
            key={index}
            disabled={disabled}
            style={[styles.dayItem, {opacity}]}>
            <TextContent
              style={[styles.dayText, {color: theme.colors.disabledText}]}>
              {day.format('ddd')}
            </TextContent>
            <View
              style={[
                styles.dateContainer,
                {
                  backgroundColor: theme.colors.surface[200],
                  borderColor: color,
                },
              ]}>
              <TextContent style={styles.dateContainerText}>
                {day.date()}
              </TextContent>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

interface IInfoModelProps {
  habit: THabit;
  category: ICategory;
  repeatInfo: string;
  onClose: () => void;
  onDelete: (habit: THabit) => void;
  archive: (habit: THabit) => void;
}

const InfoModel = ({
  habit,
  onClose,
  category,
  repeatInfo,
  onDelete,
  archive,
}: IInfoModelProps) => {
  const {theme} = useTheme();
  const {navigate} = useNavigator();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({
    name,
    iconName,
    onPress,
    borderTop = 0,
  }: {
    name: string;
    iconName: string;
    onPress: () => void;
    borderTop?: number;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.menuItem,
        {
          borderTopWidth: borderTop,
          borderTopColor: theme.colors.surface[200],
        },
      ]}>
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color={theme.colors.disabledText}
      />
      <TextContent style={styles.menuItemText}>{name}</TextContent>
    </Pressable>
  );

  return (
    <>
      <Modal
        isVisible={!!habit}
        updateVisibility={visibility => {
          if (!visibility) onClose();
        }}
        placeContentAtBottom={true}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: theme.colors.surface[100]},
          ]}>
          <Title habit={habit} category={category} repeatInfo={repeatInfo} />
          <Item
            name="Calendar"
            iconName="calendar-outline"
            onPress={() => {
              onClose();
              navigate('HabitInfo', {
                category,
                habit,
                tab: HABIT_INFO_TAB.CALENDAR,
              });
            }}
            borderTop={1}
          />
          <Item
            name="Statistics"
            iconName="chart-line"
            onPress={() => {
              onClose();
              navigate('HabitInfo', {
                category,
                habit,
                tab: HABIT_INFO_TAB.STATS,
              });
            }}
          />
          <Item
            name="Edit"
            iconName="pencil-outline"
            onPress={() => {
              onClose();
              navigate('HabitInfo', {
                category,
                habit,
                tab: HABIT_INFO_TAB.EDIT,
              });
            }}
          />
          <Item
            name="Archive"
            iconName="archive-arrow-down-outline"
            onPress={() => {
              archive(habit);
              onClose();
            }}
            borderTop={1}
          />
          <Item
            name="Delete"
            iconName="trash-can-outline"
            onPress={() => setOpenDeleteModal(true)}
          />
        </View>
      </Modal>

      <ConfirmationModal
        text="Delete Habit?"
        color={commonColors.red}
        isOpen={openDeleteModal}
        onOk={() => {
          onDelete(habit);
          setOpenDeleteModal(false);
          onClose();
        }}
        onCancel={() => setOpenDeleteModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 16,
    paddingHorizontal: 16,
  },
  item: {
    // padding: 16,
    borderRadius: 16,
  },
  itemTop: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 16,
  },
  progressButtonWrapper: {marginLeft: 'auto'},
  habitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitNameContainer: {
    flexDirection: 'column',
    rowGap: 4,
  },
  label: {
    borderRadius: 4,
    width: 'auto',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  daysContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    columnGap: 12,
    paddingHorizontal: 16,
    // paddingTop: 4,
    paddingBottom: 12,
  },
  dayItem: {
    flexDirection: 'column',
    rowGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  dateContainerText: {fontSize: 14, fontFamily: 'Inter-SemiBold'},
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
  },
  itemBottom: {
    padding: 8,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemBottomPart: {
    flexDirection: 'row',
    columnGap: 8,
  },
  itemBottomPart2: {
    flexDirection: 'row',
    columnGap: 16,
  },
  bottomMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 4,
  },
  bottomMenuItemText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  modalContainer: {
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
  },
});
