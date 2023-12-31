import moment, {Moment} from 'moment';
import React from 'react';
import {Modal} from '../../components/Modal';
import {Calendar} from '../../components/Calendar';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';

interface ICalendarModal {
  isCalendarOpen: boolean;
  updateCalendarModalVisibility: (visibility: boolean) => void;
  currentDate?: Moment;
  updateCurrentDate: (date: Moment) => void;
  startDate?: Moment;
}

export const CalendarModal = ({
  isCalendarOpen,
  updateCalendarModalVisibility,
  currentDate,
  updateCurrentDate,
  startDate,
}: ICalendarModal) => {
  const {theme} = useTheme();

  const closeModal = () => updateCalendarModalVisibility(false);

  const handleUpdateDate = (date: Moment) => {
    updateCurrentDate(date);
    closeModal();
  };

  return (
    <Modal
      placeContentAtBottom
      isVisible={isCalendarOpen}
      updateVisibility={updateCalendarModalVisibility}>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <Calendar
          selectedDate={currentDate}
          updateCurrentDate={handleUpdateDate}
          startDate={startDate}
        />
        <View
          style={[
            styles.actionsContainer,
            {borderColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={closeModal}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent>
              <Text style={[styles.buttonText]}>CLOSE</Text>
            </TextContent>
          </Pressable>
          <Pressable
            onPress={() => handleUpdateDate(moment().startOf('day'))}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent>
              <Text style={[styles.buttonText]}>TODAY</Text>
            </TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 8,
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
});
