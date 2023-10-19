import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';

export const SelectStartDate = () => {
  return (
    <View style={[styles.wrapper]}>
      <Title title="When do you want to do it?" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {paddingHorizontal: 8, paddingBottom: 200},
});
