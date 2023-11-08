import React, {useState} from 'react';
import {useTheme} from '../../../ThemeProvider';
import {Modal} from '../../components/Modal';
import {Pressable, StyleSheet, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {TextInput} from '../../components/TextInput';

interface ITextInputModalProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateText: (val: string) => void;
  title?: string;
  label: string;
  defaultValue?: string;
  targetValue?: string;
  description?: string;
}

export const TextInputModal = ({
  isOpen,
  title,
  label,
  updateText,
  updateVisibility,
  defaultValue,
  description,
  targetValue,
}: ITextInputModalProps) => {
  const {theme} = useTheme();

  const [value, setValue] = useState(defaultValue);

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    updateText(value || '');
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
        {title && (
          <View
            style={[styles.titleContainer, {borderBottomColor: borderColor}]}>
            <TextContent style={[styles.titleText]}>{title}</TextContent>
          </View>
        )}
        <View style={[styles.nameTextInputContainer]}>
          <View style={{width: '100%'}}>
            <TextInput
              label={label}
              autoFocus={true}
              onChangeText={text => setValue(text)}
              value={value}
              labelBackgroundColor={theme.colors.surface[100]}
            />
          </View>
          {Boolean(description) && (
            <TextContent
              style={[styles.targetInput, {color: theme.colors.disabledText}]}>
              {description}
            </TextContent>
          )}
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
    textAlign: 'center',
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
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    width: '80%',
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
