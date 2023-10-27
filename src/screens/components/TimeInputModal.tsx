import React, {useState} from 'react';
import {Modal} from '../../components/Modal';
import {Pressable, StyleSheet, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {TextInput} from '../../components/TextInput';

interface ITimeInputModalProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateTime: (val: string) => void;
  title: string;
  defaultValue?: string;
  targetValue?: string;
}

export const TimeInputModal = ({
  isOpen,
  updateTime,
  updateVisibility,
  title,
  defaultValue = '00:00:00',
  targetValue,
}: ITimeInputModalProps) => {
  const {theme} = useTheme();

  const [value, setValue] = useState(defaultValue);

  const [hours, minutes, seconds] = value.split(':');

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    updateTime(value);
    onClose();
  };

  const borderColor = theme.colors.surface[200];

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.titleContainer, {borderBottomColor: borderColor}]}>
          <TextContent style={[styles.titleText]}>{title}</TextContent>
        </View>
        <View style={[styles.nameTextInputContainer]}>
          <View style={[styles.inputWrapper]}>
            <TextInput
              flex={2}
              label="Hours"
              onChangeText={hours => {
                if (Number.isInteger(+hours))
                  setValue(`${hours.padStart(2, '0')}:${minutes}:${seconds}`);
              }}
              value={hours === '0' ? '' : (+hours).toString()}
              keyboardType="number-pad"
              maxLength={3}
              labelBackgroundColor={theme.colors.surface[100]}
            />
            <TextInput
              flex={2}
              label="Minutes"
              onChangeText={minutes => {
                if (Number.isInteger(+minutes))
                  setValue(`${hours}:${minutes.padStart(2, '0')}:${seconds}`);
              }}
              value={minutes === '0' ? '' : (+minutes).toString()}
              keyboardType="number-pad"
              maxLength={2}
              labelBackgroundColor={theme.colors.surface[100]}
            />
            <TextInput
              flex={2}
              label="Seconds"
              onChangeText={seconds => {
                if (Number.isInteger(+seconds))
                  setValue(`${hours}:${minutes}:${seconds.padStart(2, '0')}`);
              }}
              value={seconds === '0' ? '' : (+seconds).toString()}
              keyboardType="number-pad"
              maxLength={2}
              labelBackgroundColor={theme.colors.surface[100]}
            />
          </View>
          {targetValue !== undefined && (
            <TextContent
              style={[styles.targetInput, {color: theme.colors.disabledText}]}>
              Progress: {value}/{targetValue}
            </TextContent>
          )}
        </View>
        <View style={[styles.actionsContainer, {borderTopColor: borderColor}]}>
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
  targetInput: {
    fontSize: 12,
  },
  incButtonText: {
    fontSize: 22,
  },
  numButton: {
    textAlign: 'center',
    width: '60%',
    fontSize: 18,
  },
  incButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '20%',
  },
  incButtonLeft: {borderRightWidth: 1},
  incButtonRight: {borderLeftWidth: 1},
  inputWrapper: {
    flexDirection: 'row',
    columnGap: 8,
  },
  titleText: {fontFamily: 'Inter-Medium', fontSize: 14},
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  containerEdit: {
    flexDirection: 'column',
    borderRadius: 20,
    maxHeight: 360,
  },
  nameTextInputContainer: {padding: 16, rowGap: 12, alignItems: 'center'},
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
});
