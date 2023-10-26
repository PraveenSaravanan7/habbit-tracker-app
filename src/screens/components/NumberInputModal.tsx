import React, {useState} from 'react';
import {Modal} from '../../components/Modal';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface INumberInputModalProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateNumber: (val: number) => void;
  title: string;
  defaultValue?: number;
}

export const NumberInputModal = ({
  isOpen,
  updateNumber,
  updateVisibility,
  title,
  defaultValue = 0,
}: INumberInputModalProps) => {
  const {theme} = useTheme();

  const [value, setValue] = useState(defaultValue);

  const onClose = () => updateVisibility(false);

  const onOk = () => {
    updateNumber(value);
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
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.colors.surface[200],
                borderColor: theme.colors.surface[300],
              },
            ]}>
            <Pressable
              onPress={() => setValue(prev => prev - 1)}
              style={[
                styles.incButton,
                {borderRightWidth: 1, borderColor: theme.colors.surface[300]},
              ]}>
              <MaterialCommunityIcons name="minus" color="#fff" size={22} />
            </Pressable>
            <TextInput
              style={[styles.numButton]}
              autoFocus={true}
              onChangeText={text => setValue(+text)}
              value={value.toString()}
              keyboardType="number-pad"
              maxLength={4}
            />
            <Pressable
              onPress={() => setValue(prev => prev + 1)}
              style={[
                styles.incButton,
                {borderLeftWidth: 1, borderColor: theme.colors.surface[300]},
              ]}>
              <MaterialCommunityIcons name="plus" color="#fff" size={22} />
            </Pressable>
          </View>
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
