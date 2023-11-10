import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../../ThemeProvider';
import {MAIN_TABS} from './types';
import {TextContent} from '../../components/TextContent';
import {useNavigator} from '../../../NavigationUtils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Modal} from '../../components/Modal';

interface IFooterProps {
  activeTab: MAIN_TABS;
  updateActiveTab: (screen: MAIN_TABS) => void;
}

const tabs: {name: MAIN_TABS; iconName: string}[] = [
  {
    name: MAIN_TABS.TODAY,
    iconName: 'format-list-bulleted',
  },
  {
    name: MAIN_TABS.HABIT,
    iconName: 'reload',
  },
  {
    name: MAIN_TABS.TASK,
    iconName: 'checkbox-marked-circle-outline',
  },
  {
    name: MAIN_TABS.CATEGORY,
    iconName: 'view-grid-outline',
  },
  {
    name: MAIN_TABS.TIMER,
    iconName: 'timer-outline',
  },
];

export const Footer = ({activeTab, updateActiveTab}: IFooterProps) => {
  const {theme} = useTheme();
  const {navigate} = useNavigator();
  const insets = useSafeAreaInsets();

  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface[100],
            paddingBottom: insets.bottom + 4,
          },
        ]}>
        {tabs.map((tab, index) => {
          const isActive = tab.name === activeTab;

          return (
            <Pressable
              key={index}
              style={styles.item}
              onPress={() => updateActiveTab(tab.name)}>
              <View
                style={[
                  styles.iconContainer,
                  isActive && {backgroundColor: theme.colors.primary[100]},
                ]}>
                <MaterialCommunityIcons
                  name={tab.iconName}
                  color={theme.colors.text}
                  size={26}
                />
              </View>
              <TextContent>
                <Text
                  style={[styles.tabName, isActive && styles.activeTabName]}>
                  {tab.name}
                </Text>
              </TextContent>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.addButtonContainer, {bottom: 98 + insets.bottom}]}>
        <Pressable
          style={styles.addButton}
          onPress={() => setIsModelOpen(true)}>
          <MaterialCommunityIcons
            name="plus"
            size={28}
            style={{color: theme.colors.text}}
          />
        </Pressable>
      </View>

      <AddHabitModel
        onPress={() => navigate('Add')}
        isOpen={isModelOpen}
        updateVisibility={(isOpen: boolean) => setIsModelOpen(isOpen)}
      />
    </>
  );
};

interface IAddHabitModelProps {
  isOpen: boolean;
  updateVisibility: (visibility: boolean) => void;
  onPress: (isTask: boolean) => void;
}

export const AddHabitModel = ({
  isOpen,
  onPress,
  updateVisibility,
}: IAddHabitModelProps) => {
  const {theme} = useTheme();

  const handleSelect = (isTask: boolean) => {
    onPress(isTask);
    updateVisibility(false);
  };

  // eslint-disable-next-line react/no-unstable-nested-components
  const Item = ({
    onSelect,
    borderBottomWidth,
    icon,
    name,
    description,
  }: {
    onSelect: () => void;
    borderBottomWidth: number;
    icon: string;
    name: string;
    description: string;
  }) => (
    <Pressable
      onPress={onSelect}
      style={[
        styles.menuItem,
        {
          borderBottomColor: theme.colors.surface[200],
          borderBottomWidth,
        },
      ]}>
      <MaterialCommunityIcons
        name={icon}
        size={26}
        color={theme.colors.primary[100]}
      />
      <View style={styles.itemTextContainer}>
        <TextContent fontSize={18} fontFamily="Inter-Bold">
          {name}
        </TextContent>
        <TextContent fontSize={12} color={theme.colors.disabledText}>
          {description}
        </TextContent>
      </View>

      <View style={styles.itemRightIconContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={26}
          color={theme.colors.disabledText}
        />
      </View>
    </Pressable>
  );

  return (
    <Modal
      placeContentAtBottom
      isVisible={isOpen}
      updateVisibility={updateVisibility}>
      <View
        style={[
          styles.modalContainer,
          {backgroundColor: theme.colors.surface[100]},
        ]}>
        <Item
          onSelect={() => handleSelect(false)}
          borderBottomWidth={1}
          description="A recurrent, automatic behavior acquired through frequent repetition."
          icon="reload"
          name="Habit"
        />
        <Item
          onSelect={() => handleSelect(false)}
          borderBottomWidth={0}
          description="A specific, goal-oriented activity or assignment requiring effort and completion."
          icon="checkbox-marked-circle-outline"
          name="Task"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#302c36',
    flexDirection: 'row',
    paddingVertical: 8,
    color: '#fff',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1,
  },
  item: {
    // backgroundColor: "red",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    flexDirection: 'column',
    rowGap: 4,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 98,
    right: 16,
    zIndex: 1,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 58,
    height: 58,
    backgroundColor: '#673ab7',
    borderRadius: 18,
  },
  tabName: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
  },
  activeTabName: {fontSize: 10, fontFamily: 'Inter-ExtraBold'},
  iconContainer: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 14,
  },
  modalContainer: {
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  itemTextContainer: {
    width: '80%',
    rowGap: 4,
  },
  itemRightIconContainer: {
    marginLeft: 'auto',
  },
});
