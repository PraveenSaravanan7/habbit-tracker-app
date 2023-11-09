import React, {useState} from 'react';
import {Modal} from '../../components/Modal';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {CategoryIcon} from './CategoryIcon';
import {THabit} from '../../database/models/habit';
import {convertHexToRGBA, getRepeatText} from '../../utils';

interface IHabitSelectionModelProps {
  isOpen: boolean;
  habits: THabit[];
  updateVisibility: (visibility: boolean) => void;
  updateHabit: (val: THabit) => void;
  title?: string;
}

export const HabitSelectionModel = ({
  habits,
  isOpen,
  title,
  updateHabit,
  updateVisibility,
}: IHabitSelectionModelProps) => {
  const {theme} = useTheme();

  const [categories] = useState<ICategory[]>(() => getCategoryModel().find());

  const getCategory = (habit: THabit) =>
    categories.find(category => category.id === habit.category);

  const onClose = () => updateVisibility(false);

  const onOk = (habit: THabit) => {
    updateHabit(habit);
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
        <ScrollView
          keyboardShouldPersistTaps={'handled'}
          contentContainerStyle={[styles.scrollContainer]}>
          {habits.map((habit, key) => {
            const category = getCategory(habit);

            if (!category) return null;

            return (
              <Pressable
                onPress={() => onOk(habit)}
                style={[
                  styles.item,
                  {backgroundColor: theme.colors.surface[100]},
                ]}
                key={key}>
                <View style={[styles.itemTop]}>
                  <View style={styles.habitNameContainer}>
                    <TextContent style={[styles.habitName]}>
                      {habit.habitName}
                    </TextContent>
                    <View
                      style={[
                        styles.label,
                        {
                          backgroundColor: convertHexToRGBA(
                            category.color,
                            0.2,
                          ),
                        },
                      ]}>
                      <TextContent
                        style={[styles.labelText, {color: category.color}]}>
                        {getRepeatText(habit)}
                      </TextContent>
                    </View>
                  </View>

                  <CategoryIcon
                    category={category}
                    size={36}
                    borderRadius={12}
                    iconSize={22}
                  />
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={[styles.actionsContainer, {borderTopColor: borderColor}]}>
          <Pressable
            onPress={onClose}
            style={[
              styles.actionButton,
              {backgroundColor: theme.colors.surface[100]},
            ]}>
            <TextContent style={[styles.actionButtonText]}>CLOSE</TextContent>
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
  inputWrapper: {
    width: '100%',
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
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingVertical: 16,
    columnGap: 20,
    rowGap: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    rowGap: 4,
  },
  item: {
    // padding: 16,
    borderRadius: 16,
    width: '100%',
  },
  habitNameContainer: {
    flexDirection: 'column',
    rowGap: 4,
  },
  label: {
    borderRadius: 4,
    width: 'auto',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  labelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  habitName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  itemTop: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
