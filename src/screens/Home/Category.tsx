import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {ICategory} from '../../database/models/category';
import database from '../../database/database';
import COLLECTION from '../../database/collections';
import {TextContent} from '../../components/TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';

export const Category = () => {
  const {theme} = useTheme();
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    setCategories(() => database.getCollection(COLLECTION.CATEGORIES)?.find());
  }, []);

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
  // const EmptyBanner = () => (
  //   <View>
  //     <MaterialCommunityIcons name="" size={12} />
  //   </View>
  // );

  return (
    <View style={[styles.container]}>
      <View style={[styles.listNameContainer]}>
        <TextContent style={[styles.listName]}>Default categories</TextContent>
      </View>
      <ScrollView
        horizontal
        contentContainerStyle={[styles.listContainer]}
        showsHorizontalScrollIndicator={false}>
        {categories.map(category =>
          category.isCustom ? null : (
            <Item category={category} key={category.id} />
          ),
        )}
      </ScrollView>
      <View
        style={[styles.br, {borderBottomColor: theme.colors.surface[200]}]}
      />
      <View style={[styles.listNameContainer]}>
        <TextContent style={[styles.listName]}>Custom categories</TextContent>
      </View>
    </View>
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
  },
});
