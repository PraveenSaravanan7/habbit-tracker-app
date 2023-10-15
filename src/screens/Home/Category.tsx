import React, {useLayoutEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import getCategoryModel, {ICategory} from '../../database/models/category';
import {TextContent} from '../../components/TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';
import {AddCategoryModal} from './AddCategoryModal';

export const Category = () => {
  const {theme} = useTheme();
  const categoryModel = getCategoryModel();

  const [defaultCategories, setDefaultCategories] = useState<ICategory[]>([]);
  const [customCategories, setCustomCategories] = useState<ICategory[]>([]);

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<ICategory | null>(null);

  const updateAddCategoryModalVisibility = (visibility: boolean) => {
    if (!visibility && editCategory) setEditCategory(null);

    setIsAddCategoryOpen(visibility);
  };

  const addCategory = (category: ICategory) => {
    setCustomCategories(prev => [...prev, category]);
    categoryModel.insertOne(category);
  };

  const updateCategory = (category: ICategory) => {
    // if (!editCategory) return;
    // setCustomCategories(prev => [...prev, category]);
    categoryModel.updateWhere(
      data => data.id === category?.id,
      data => {
        data.color = category.color;
        data.icon = category.icon;
        data.name = category.name;

        return data;
      },
    );
  };

  const deleteCategory = (category: ICategory) => {
    categoryModel.remove(category.$loki || 0);
    setCustomCategories(prev =>
      [...prev].filter(cand => cand.id !== category.id),
    );
  };

  useLayoutEffect(() => {
    const categories = categoryModel.find();

    const defaultItems: ICategory[] = [];
    const customItems: ICategory[] = [];

    categories.forEach(category => {
      if (category.isCustom) customItems.push(category);
      else defaultItems.push(category);
    });

    setDefaultCategories(defaultItems);
    setCustomCategories(customItems);
  }, [categoryModel]);

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({category}: {category: ICategory}) => (
    <View style={[styles.categoryContainer]}>
      <View style={[styles.categoryIcon, {backgroundColor: category.color}]}>
        <MaterialCommunityIcons name={category.icon} color={'#fff'} size={34} />
      </View>
      <TextContent
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.categoryName]}>
        {category.name}
      </TextContent>
    </View>
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const EmptyBanner = () => (
    <View style={[styles.emptyBanner]}>
      <MaterialCommunityIcons
        name="view-grid-outline"
        size={46}
        color={theme.colors.disabledText}
      />
      <TextContent
        style={[styles.emptyBannerText, {color: theme.colors.disabledText}]}>
        There are no custom categories
      </TextContent>
    </View>
  );

  return (
    <>
      <View style={[styles.container]}>
        <View style={[styles.listNameContainer]}>
          <TextContent style={[styles.listName]}>
            Default categories
          </TextContent>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={[styles.listContainer]}
          showsHorizontalScrollIndicator={false}>
          {defaultCategories.map(category => (
            <Item category={category} key={category.id} />
          ))}
        </ScrollView>
        <View
          style={[styles.br, {borderBottomColor: theme.colors.surface[200]}]}
        />
        <View style={[styles.listNameContainer]}>
          <TextContent style={[styles.listName]}>Custom categories</TextContent>
        </View>
        {!customCategories.length && <EmptyBanner />}
        {!!customCategories.length && (
          <ScrollView
            horizontal
            contentContainerStyle={[styles.listContainer]}
            showsHorizontalScrollIndicator={false}>
            {customCategories.map(category => (
              <Pressable
                key={category.id}
                onPress={() => {
                  setEditCategory(category);
                  updateAddCategoryModalVisibility(true);
                }}>
                <Item category={category} />
              </Pressable>
            ))}
          </ScrollView>
        )}
        <Pressable
          onPress={() => updateAddCategoryModalVisibility(true)}
          style={[styles.button, {backgroundColor: theme.colors.primary[100]}]}>
          <TextContent style={[styles.buttonText]}>NEW CATEGORY</TextContent>
        </Pressable>
      </View>

      {isAddCategoryOpen && (
        <AddCategoryModal
          isOpen={isAddCategoryOpen}
          updateVisibility={updateAddCategoryModalVisibility}
          upsertCategory={editCategory ? updateCategory : addCategory}
          categoryToUpdate={editCategory}
          deleteCategory={deleteCategory}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 240,
    rowGap: 8,
  },
  listNameContainer: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    rowGap: 4,
  },
  listName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  listContainer: {flexDirection: 'row', columnGap: 4, paddingLeft: 16},
  categoryContainer: {
    width: 68,
    // padding: 8,
    flexDirection: 'column',
    rowGap: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  categoryIcon: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  categoryName: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    width: '100%',
    // backgroundColor: 'green',
    textAlign: 'center',
  },
  br: {
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  emptyBanner: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    rowGap: 8,
  },
  emptyBannerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
  },
});
