import React, {useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import {convertHexToRGBA} from '../../utils';
import {Button} from '../../components/Button';
import {commonColors} from '../../../themes';

export const Timer = () => {
  const {theme} = useTheme();

  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleStartTimer = () => setIsRunning(true);

  const handleStopTimer = () => setIsRunning(false);

  const handleResetTimer = () => setCurrentTime(0);

  const formatTime = (time: number) => {
    const pad = (val: number) => String(val).padStart(2, '0');
    const hours = pad(Math.floor(time / 3600));
    const minutes = pad(Math.floor((time % 3600) / 60));
    const seconds = pad(Math.floor(time % 60));

    return `${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentTime(currentTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, currentTime]);

  return (
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
            title="START"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
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
  },
});
