import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from '../../ThemeProvider';

interface IRadioProps {
  selected?: boolean;
  size?: number;
}

export const Radio = ({selected, size = 18}: IRadioProps) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.radio,
        {
          height: size,
          width: size,
          borderColor: selected
            ? theme.colors.primary[100]
            : theme.colors.disabledText,
        },
      ]}>
      {selected && (
        <View
          style={[
            styles.radioInner,
            {
              height: size - 10,
              width: size - 10,
              backgroundColor: theme.colors.primary[100],
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});
