import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {Modal} from '../../components/Modal';
import {TextContent} from '../../components/TextContent';
import {Radio} from '../../components/Radio';

interface ICheckListModalProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateChecked: (val: number[]) => void;
  defaultChecked?: number[];
  list: string[];
}

export const CheckListModal = ({
  defaultChecked = [],
  isOpen,
  updateChecked,
  updateVisibility,
  list,
}: ICheckListModalProps) => {
  const {theme} = useTheme();
  const [checked, setChecked] = useState(defaultChecked);

  const handleUpdate = (index: number) => {
    setChecked(prev => {
      if (prev.includes(index)) return prev.filter(val => val !== index);

      return [...prev, index];
    });
  };

  return (
    <Modal
      width={'80%'}
      isVisible={isOpen}
      updateVisibility={visibility => {
        if (!visibility) updateChecked(checked);
        updateVisibility(visibility);
      }}>
      <View style={[styles.centeredView]}>
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          style={[
            styles.container,
            {backgroundColor: theme.colors.surface[100]},
          ]}>
          <View>
            {list.map((item, index) => (
              <Pressable
                key={item}
                style={[styles.item]}
                onPress={() => handleUpdate(index)}>
                <View style={styles.textWrapper}>
                  <TextContent style={styles.itemText}>{item}</TextContent>
                </View>
                <View>
                  <Radio selected={checked.includes(index)} />
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  textWrapper: {maxWidth: '85%'},
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  container: {
    width: 'auto',
    height: 'auto',
    maxWidth: '80%',
    maxHeight: '70%',
    borderRadius: 20,
  },
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
