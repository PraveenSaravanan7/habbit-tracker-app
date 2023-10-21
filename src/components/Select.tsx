import React, {useState} from 'react';
import {Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {TextContent} from './TextContent';
import {useTheme} from '../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Radio} from './Radio';

interface ISelectInputProps {
  list: string[];
  value: string;
  onSelect: (item: string) => void;
  flex?: number;
}

export const Select = ({list, value, flex, onSelect}: ISelectInputProps) => {
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const borderColor = isOpen
    ? theme.colors.primary[100]
    : theme.colors.disabledText;

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        style={[styles.input, {borderColor, flex}]}>
        <TextContent style={[styles.text]}>{value}</TextContent>
        <MaterialCommunityIcons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={theme.colors.text}
        />
      </Pressable>
      <Modal
        statusBarTranslucent={true}
        transparent
        animationType="slide"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}>
        <View
          style={[
            styles.centeredView,
            {backgroundColor: theme.colors.transparentBackdrop},
          ]}>
          <ScrollView
            style={[
              styles.container,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            {list.map(item => (
              <Pressable
                key={item}
                style={[styles.item]}
                onPress={() => {
                  onSelect(item);
                  setIsOpen(false);
                }}>
                <TextContent style={styles.itemText}>{item}</TextContent>
                <Radio selected={value === item} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {width: '80%', maxHeight: '70%', borderRadius: 20},
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  text: {fontSize: 14, fontFamily: 'Inter-Medium'},
  radio: {
    width: 18,
    height: 18,
    borderRadius: 100,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 100,
  },
  itemText: {
    fontSize: 16,
  },
});
