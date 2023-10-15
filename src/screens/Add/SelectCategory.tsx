import React, {useLayoutEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import getCategoryModel, {ICategory} from '../../database/models/category';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title} from './Title';

interface ISelectCategory {
  onSelectCategory: (category: ICategory) => void;
}

export const SelectCategory = ({onSelectCategory}: ISelectCategory) => {
  const {theme} = useTheme();
  const categoryModel = getCategoryModel();

  const [categories, setCategories] = useState<ICategory[]>([]);

  useLayoutEffect(() => {
    const allCategories = categoryModel.find();

    setCategories(() =>
      [...allCategories].sort((a, _) => (a.isCustom ? 1 : 0)),
    );
  }, [categoryModel]);

  return (
    <View style={[styles.wrapper]}>
      <Title title="Select a category for your habit" />
      <View style={[styles.container]}>
        {categories.map(category => (
          <Pressable
            onPress={() => onSelectCategory(category)}
            key={category.id}
            style={[styles.item, {backgroundColor: theme.colors.surface[100]}]}>
            <View style={[styles.textContainer]}>
              <TextContent
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.categoryName]}>
                {category.name}
              </TextContent>
            </View>
            <View
              style={[styles.iconContainer, {backgroundColor: category.color}]}>
              <MaterialCommunityIcons
                name={category.icon}
                color={'#fff'}
                size={22}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {width: '80%'},
  wrapper: {paddingHorizontal: 8, paddingBottom: 200},
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    // backgroundColor: 'red',
    rowGap: 16,
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopWidth: 1,
    marginTop: 8,
    position: 'absolute',
    bottom: 0,
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
  item: {
    // flexBasis: '50%',
    width: '48%',
    padding: 8,
    // paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    height: 32,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  categoryName: {fontSize: 13, fontFamily: 'Inter-Medium'},
});
