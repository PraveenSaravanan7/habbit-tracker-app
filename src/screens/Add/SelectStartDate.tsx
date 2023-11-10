import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Title} from './Title';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import moment from 'moment';
import {CalendarModal} from '../components/CalendarModal';
import {NumberInputModal} from '../components/NumberInputModal';

interface ISelectStartDateProps {
  startDate: string;
  endDate: string;
  priority: number;
  updateStartDate: (date: string) => void;
  updateEndDate: (date: string) => void;
  updatePriority: (val: number) => void;
  noRepeat: boolean;
}

export const SelectStartDate = ({
  startDate,
  endDate,
  priority,
  noRepeat,
  updateEndDate,
  updatePriority,
  updateStartDate,
}: ISelectStartDateProps) => {
  const {theme} = useTheme();
  const dateFormat = 'DD/MM/YYYY';

  const buttonBackground = theme.colors.surface[200];
  const iconColor = theme.colors.primary[100];
  const borderBottomColor = theme.colors.surface[100];

  const [openStartDateModel, setOpenStartDateModel] = useState(false);
  const [openEndDateModel, setOpenEndDateModel] = useState(false);
  const [openPriorityModel, setOpenPriorityModel] = useState(false);

  return (
    <View style={[styles.wrapper]}>
      <View style={[styles.titleWrapper]}>
        <Title title="When do you want to do it?" />
      </View>

      <View>
        <Pressable
          onPress={() => setOpenStartDateModel(true)}
          style={[styles.item, {borderBottomColor}]}>
          <View style={[styles.iconContainer]}>
            <MaterialCommunityIcons
              name="calendar"
              color={iconColor}
              size={28}
            />
            <TextContent style={[styles.itemText]}>
              {noRepeat ? 'Date' : 'Start Date'}
            </TextContent>
          </View>
          <View style={[styles.button, {backgroundColor: buttonBackground}]}>
            <TextContent style={[styles.buttonText]}>
              {moment(startDate, dateFormat).isSame(moment().startOf('day'))
                ? 'Today'
                : startDate}
            </TextContent>
          </View>
        </Pressable>

        {!noRepeat && (
          <Pressable
            style={[styles.item, {borderBottomColor}]}
            onPress={() => setOpenEndDateModel(true)}>
            <View style={[styles.iconContainer]}>
              <MaterialCommunityIcons
                name="calendar"
                color={iconColor}
                size={28}
              />
              <TextContent style={[styles.itemText]}>End Date</TextContent>
            </View>

            <View style={[styles.endDateContainer]}>
              <View
                style={[styles.button, {backgroundColor: buttonBackground}]}>
                <TextContent style={[styles.buttonText]}>
                  {!endDate ? 'None' : endDate}
                </TextContent>
              </View>

              {Boolean(endDate) && (
                <Pressable
                  style={[styles.button, {backgroundColor: buttonBackground}]}
                  onPress={() => updateEndDate('')}>
                  <MaterialCommunityIcons
                    name="close"
                    color={theme.colors.text}
                    size={18}
                  />
                </Pressable>
              )}
            </View>
          </Pressable>
        )}

        <Pressable
          style={[styles.item]}
          onPress={() => setOpenPriorityModel(true)}>
          <View style={[styles.iconContainer]}>
            <MaterialCommunityIcons
              name="flag-outline"
              color={iconColor}
              size={28}
            />
            <TextContent style={[styles.itemText]}>Priority</TextContent>
          </View>
          <Pressable
            onPress={() => setOpenPriorityModel(true)}
            style={[styles.button, {backgroundColor: buttonBackground}]}>
            <TextContent style={[styles.buttonText]}>
              {priority === 1 ? (
                'Default'
              ) : (
                <>
                  {priority + ' '}
                  <MaterialCommunityIcons
                    name="flag"
                    color={theme.colors.text}
                    size={14}
                  />
                </>
              )}
            </TextContent>
          </Pressable>
        </Pressable>
      </View>

      {openStartDateModel && (
        <CalendarModal
          currentDate={moment(startDate, dateFormat)}
          isCalendarOpen={openStartDateModel}
          updateCalendarModalVisibility={visibility =>
            setOpenStartDateModel(visibility)
          }
          updateCurrentDate={date =>
            updateStartDate(date.format(dateFormat).toString())
          }
        />
      )}

      {openEndDateModel && (
        <CalendarModal
          currentDate={endDate ? moment(endDate, dateFormat) : undefined}
          isCalendarOpen={openEndDateModel}
          updateCalendarModalVisibility={visibility =>
            setOpenEndDateModel(visibility)
          }
          updateCurrentDate={date =>
            updateEndDate(date.format(dateFormat).toString())
          }
          startDate={moment(startDate, dateFormat)}
        />
      )}

      {openPriorityModel && (
        <NumberInputModal
          isOpen={openPriorityModel}
          title="Set a priority"
          updateNumber={val => updatePriority(val)}
          updateVisibility={visibility => setOpenPriorityModel(visibility)}
          defaultValue={+priority}
          description="Higher priority activities will be displayed higher in the list"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {paddingBottom: 200},
  titleWrapper: {paddingHorizontal: 8},
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {fontFamily: 'Inter-SemiBold', fontSize: 12},
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 12,
  },
  itemText: {
    fontFamily: 'Inter-Medium',
  },
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
  endDateContainer: {flexDirection: 'row', columnGap: 8},
});
