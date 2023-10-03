import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ICategory} from '../../database/models/category';
import database from '../../database/database';
import COLLECTION from '../../database/collections';
import {TextContent} from '../../components/TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const Category = () => {
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
      <View>
        <TextContent numberOfLines={1} ellipsizeMode="tail">
          <Text style={[styles.categoryName]}>{category.name}</Text>
        </TextContent>
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      {categories.map(category => (
        <Item category={category} key={category.id} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingBottom: 240, flexDirection: 'row', flexWrap: 'wrap'},
  categoryContainer: {
    width: '25%',
    padding: 8,
    flexDirection: 'column',
    rowGap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 58,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
});
