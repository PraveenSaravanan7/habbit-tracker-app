import React, {useState} from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useTheme} from '../../../ThemeProvider';
import {Modal} from '../../components/Modal';
import {TextContent} from '../../components/TextContent';
import {Checkbox} from '../../components/Checkbox';

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

  const done = () => {
    updateChecked(checked);
    updateVisibility(false);
  };

  return (
    <Modal width={'80%'} isVisible={isOpen} updateVisibility={updateVisibility}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface[100],
            maxHeight: Dimensions.get('screen').height * 0.7,
          },
        ]}>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          {list.map((item, index) => (
            <Pressable
              key={item}
              style={[styles.item]}
              onPress={() => handleUpdate(index)}>
              <View style={styles.textWrapper}>
                <TextContent style={styles.itemText}>{item}</TextContent>
              </View>
              <View>
                <Checkbox selected={checked.includes(index)} />
              </View>
            </Pressable>
          ))}
        </ScrollView>
        <View
          style={[
            styles.buttonWrapper,
            {borderColor: theme.colors.surface[200]},
          ]}>
          <Pressable
            style={[styles.button]}
            onPress={() => updateVisibility(false)}>
            <TextContent style={styles.buttonText}>CLOSE</TextContent>
          </Pressable>
          <Pressable style={[styles.button]} onPress={done}>
            <TextContent style={styles.buttonText}>DONE</TextContent>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonText: {fontFamily: 'Inter-Bold'},
  buttonWrapper: {flexDirection: 'row', borderTopWidth: 1},
  container: {borderRadius: 20, height: 'auto'},
  textWrapper: {maxWidth: '85%'},
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 16,
  },
});
