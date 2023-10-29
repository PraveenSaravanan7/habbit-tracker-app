import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICategory} from '../../database/models/category';

interface ICategoryIconProps {
  category: ICategory;
  size: number;
  borderRadius: number;
  iconSize: number;
  onPress?: () => void;
}

export const CategoryIcon = ({
  size,
  borderRadius,
  category,
  iconSize,
  onPress,
}: ICategoryIconProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryIcon,
        {
          backgroundColor: category.color,
          width: size,
          borderRadius,
        },
      ]}>
      <MaterialCommunityIcons
        name={category.icon}
        color={'#fff'}
        size={iconSize}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  categoryIcon: {
    // width: 58,
    // height: 58,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 20,
  },
});
