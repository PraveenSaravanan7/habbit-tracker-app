import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {TextInput} from '../../components/TextInput';

export const Description = () => {
  const [nameTextInput, setNameTextInput] = useState('');
  const [description, setDescription] = useState('');

  const updateName = (name: string) => setNameTextInput(name);
  const updateDescription = (name: string) => setDescription(name);

  return (
    <View style={[styles.wrapper]}>
      <Title title="Define your habit" />
      <View style={{rowGap: 16}}>
        <TextInput
          label="Habit"
          onChangeText={updateName}
          value={nameTextInput}
          placeholder=""
        />
        <TextInput
          label="Description (Optional)"
          onChangeText={updateDescription}
          value={description}
          placeholder=""
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {paddingHorizontal: 8, paddingBottom: 200},
});
