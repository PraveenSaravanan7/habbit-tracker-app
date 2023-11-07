import React from 'react';
import {Modal} from '../../components/Modal';
import {Pressable, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';

interface IConfirmationModalProps {
  isOpen: boolean;
  text: string;
  onCancel: () => void;
  onOk: () => void;
  color: string;
}

export const ConfirmationModal = ({
  isOpen,
  onCancel,
  onOk,
  text,
  color,
}: IConfirmationModalProps) => {
  const {theme} = useTheme();

  return (
    <Modal
      width={'80%'}
      isVisible={isOpen}
      updateVisibility={visibility => {
        if (!visibility) onCancel();
      }}>
      <View
        style={[
          styles.containerEdit,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <View style={[styles.nameTextInputContainer]}>
          <View>
            <TextContent style={[styles.deleteQuestion, {color}]}>
              {text}
            </TextContent>
          </View>
        </View>
        <View
          style={[
            styles.actionsContainer,
            {borderTopColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            onPress={onOk}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText, {color}]}>YES</TextContent>
          </Pressable>
          <Pressable
            onPress={onCancel}
            style={[
              styles.button,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.buttonText]}>NO</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  deleteQuestion: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  nameTextInputContainer: {padding: 16, rowGap: 12},
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
});
