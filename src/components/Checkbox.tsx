import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../ThemeProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ICheckboxProps {
  selected?: boolean;
  size?: number;
}

export const Checkbox = ({selected, size = 18}: ICheckboxProps) => {
  const {theme} = useTheme();

  const borderWidth = selected ? 0 : 2;

  return (
    <View
      style={[
        styles.checkbox,
        {
          height: size,
          width: size,
          borderColor: selected
            ? theme.colors.primary[100]
            : theme.colors.disabledText,
          borderWidth,
        },
      ]}>
      {selected && (
        <View
          style={[
            styles.checkboxInner,
            {
              backgroundColor: theme.colors.primary[100],
            },
          ]}>
          <MaterialCommunityIcons
            name="check-bold"
            size={size - 4}
            color={'#fff'}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    borderRadius: 2,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
