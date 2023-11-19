import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import {convertHexToRGBA, formatTime} from '../../utils';
import {Button} from '../../components/Button';
import {commonColors} from '../../../themes';
import getHabitModel, {HABIT_TYPES} from '../../database/models/habit';
import {HabitSelectionModel} from '../components/HabitSelectionModel';
import {useHabitUpdate} from '../../hooks/useHabitUpdate';
import moment from 'moment';

export const Timer = () => {
  const {theme} = useTheme();
  const {HabitProgressModels, updateProgress, historyUpdated} =
    useHabitUpdate();

  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [habits] = useState(() =>
    getHabitModel().find({habitType: HABIT_TYPES.TIMER}),
  );
  const [openHabitListModel, setOpenHabitListModel] = useState(false);

  const updateModelVisibility = (visibility: boolean) =>
    setOpenHabitListModel(visibility);

  const handleStartTimer = () => setIsRunning(true);

  const handleStopTimer = () => setIsRunning(false);

  const handleResetTimer = () => setCurrentTime(0);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(currentTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, currentTime]);

  useEffect(() => {
    handleResetTimer();
  }, [historyUpdated]);

  return (
    <>
      <View style={styles.container}>
        <View
          style={[
            styles.timeCircle,
            {borderColor: convertHexToRGBA(theme.colors.primary[100], 0.4)},
          ]}>
          <TextContent fontSize={38} fontFamily="Inter-Bold">
            {formatTime(currentTime)}
          </TextContent>
        </View>
        <View style={styles.buttonContainer}>
          {!isRunning && (
            <Button
              title={currentTime ? 'RESUME' : 'START'}
              onPress={handleStartTimer}
              backgroundColor={theme.colors.primary[100]}
              icon="play"
            />
          )}
          {isRunning && (
            <Button
              backgroundColor={commonColors.red}
              title="STOP"
              onPress={handleStopTimer}
              icon="stop"
            />
          )}
          {!isRunning && !!currentTime && (
            <Button
              icon="reload"
              backgroundColor={theme.colors.surface[200]}
              title="RESET"
              onPress={handleResetTimer}
            />
          )}
        </View>
        {!isRunning && !!currentTime && (
          <View style={styles.buttonContainer}>
            <Button
              title={'SAVE'}
              onPress={() => updateModelVisibility(true)}
              backgroundColor={theme.colors.primary[100]}
              icon="content-save-check-outline"
            />
          </View>
        )}
      </View>
      {openHabitListModel && (
        <HabitSelectionModel
          habits={habits}
          isOpen={openHabitListModel}
          updateHabit={habit =>
            updateProgress(
              habit,
              moment().startOf('day'),
              formatTime(currentTime),
            )
          }
          updateVisibility={updateModelVisibility}
          title="Select a habit"
        />
      )}

      <HabitProgressModels />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    padding: 20,
    rowGap: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 'auto',
    columnGap: 20,
  },
  timeCircle: {
    width: 280,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderRadius: 1000,
    marginBottom: 20,
  },
});
