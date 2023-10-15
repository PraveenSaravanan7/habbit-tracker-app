import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TextContent} from '../../components/TextContent';
import {useTheme} from '../../../ThemeProvider';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigator} from '../../../NavigationUtils';
import {SelectCategory} from './SelectCategory';
import {ICategory} from '../../database/models/category';
import {SelectHabitType} from './SelectHabitType';
import {HABIT_TYPES} from '../../database/models/habit';
import {Description} from './Description';

enum SCREENS {
  CATEGORY = 1,
  PROGRESS,
  DEFINE,
  REPEAT,
}

export const Add = () => {
  const {theme} = useTheme();
  const {goBack} = useNavigator();
  const insets = useSafeAreaInsets();

  const backgroundColor = theme.colors.surface[100];

  const [activeScreen, setActiveScreen] = useState(SCREENS.CATEGORY);

  const [category, setCategory] = useState<ICategory>();
  const [habitType, setHabitType] = useState<HABIT_TYPES>();

  const onSelectCategory = (selectedCategory: ICategory) => {
    setCategory(selectedCategory);
    onNext();
  };

  const onSelectHabitType = (selectedHabitType: HABIT_TYPES) => {
    setHabitType(selectedHabitType);
    onNext();
  };

  const onSave = () => {};

  const onBack = () => {
    switch (activeScreen) {
      case SCREENS.CATEGORY:
        goBack();
        break;

      case SCREENS.PROGRESS:
        setActiveScreen(SCREENS.CATEGORY);
        break;

      case SCREENS.DEFINE:
        setActiveScreen(SCREENS.PROGRESS);
        break;

      case SCREENS.REPEAT:
        setActiveScreen(SCREENS.DEFINE);
        break;
    }
  };

  const onNext = () => {
    switch (activeScreen) {
      case SCREENS.CATEGORY:
        setActiveScreen(SCREENS.PROGRESS);
        break;

      case SCREENS.PROGRESS:
        setActiveScreen(SCREENS.DEFINE);
        break;

      case SCREENS.DEFINE:
        setActiveScreen(SCREENS.REPEAT);
        break;

      case SCREENS.REPEAT:
        onSave();
        break;
    }
  };

  const showEmptyButton =
    activeScreen === SCREENS.CATEGORY || activeScreen === SCREENS.PROGRESS;

  return (
    <>
      <ScrollView style={[styles.container]}>
        {activeScreen === SCREENS.CATEGORY && (
          <SelectCategory onSelectCategory={onSelectCategory} />
        )}
        {activeScreen === SCREENS.PROGRESS && (
          <SelectHabitType onSelectHabitType={onSelectHabitType} />
        )}
        {activeScreen === SCREENS.DEFINE && <Description />}
      </ScrollView>
      <View
        style={[
          styles.actionsContainer,
          {
            borderColor: theme.colors.surface[200],
            backgroundColor,
            paddingBottom: insets.bottom + 4,
          },
        ]}>
        <Pressable onPress={onBack} style={[styles.button]}>
          <TextContent>
            <Text style={[styles.buttonText]}>
              {activeScreen === SCREENS.CATEGORY ? 'CANCEL' : 'BACK'}
            </Text>
          </TextContent>
        </Pressable>
        <View style={[styles.ringsContainer]}>
          {[1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[
                styles.ring,
                {borderColor: theme.colors.primary[100]},
                i <= activeScreen && {
                  backgroundColor: theme.colors.primary[100],
                },
              ]}
            />
          ))}
        </View>
        {showEmptyButton ? (
          <View style={[styles.button]} />
        ) : (
          <Pressable onPress={onNext} style={[styles.button]}>
            <TextContent>
              <Text style={[styles.buttonText]}>
                {activeScreen === SCREENS.REPEAT ? 'SAVE' : 'NEXT'}
              </Text>
            </TextContent>
          </Pressable>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {marginTop: 40, paddingBottom: 100},
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    position: 'absolute',
    paddingTop: 4,
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
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  ring: {
    borderRadius: 100,
    height: 8,
    width: 8,
    borderWidth: 1,
  },
  ringsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 2,
  },
});
