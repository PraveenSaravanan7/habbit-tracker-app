import React from 'react';
import {Modal} from '../../components/Modal';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {CategoryIcon} from './CategoryIcon';

interface ICategoryModelProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  updateCategory: (val: ICategory) => void;
  title?: string;
}

export const CategoryModel = ({
  isOpen,
  title,
  updateCategory,
  updateVisibility,
}: ICategoryModelProps) => {
  const {theme} = useTheme();

  const onClose = () => updateVisibility(false);

  const onOk = (category: ICategory) => {
    updateCategory(category);
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
          {getCategoryModel()
            .find()
            .map(category => (
              <Pressable
                style={styles.iconContainer}
                onPress={() => onOk(category)}>
                <CategoryIcon
                  borderRadius={16}
                  category={category}
                  iconSize={28}
                  size={48}
                />
                <TextContent
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  fontSize={12}
                  maxScreenWidth={0.15}>
                  {category.name}
                </TextContent>
              </Pressable>
            ))}
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
});
