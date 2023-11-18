import React from 'react';
import {Pressable, StatusBar, StyleSheet, View} from 'react-native';
import {TextContent} from './TextContent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from '../../ThemeProvider';
import {useNavigator} from '../../NavigationUtils';

interface IHeaderBaseProps {
  title: string;
  icon?: JSX.Element;
}

interface ITabProps {
  tabs: string[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

type THeaderProps = (
  | {tabs?: never; activeTab?: never; onSelectTab?: never}
  | ITabProps
) &
  IHeaderBaseProps;

export const Header = ({
  title,
  icon,
  tabs,
  activeTab,
  onSelectTab,
}: THeaderProps) => {
  const {theme} = useTheme();
  const {goBack} = useNavigator();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.background,
          paddingTop: StatusBar.currentHeight,
          borderBottomColor: theme.colors.surface[100],
        },
      ]}>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Pressable onPress={goBack}>
            <MaterialCommunityIcons
              color={theme.colors.primary[100]}
              name="chevron-left"
              size={24}
            />
          </Pressable>
          <TextContent
            numberOfLines={1}
            ellipsizeMode="tail"
            maxScreenWidth={0.75}
            style={[styles.title, {color: theme.colors.text}]}>
            {title}
          </TextContent>
        </View>
        {icon}
      </View>
      {!!tabs && (
        <Tabs activeTab={activeTab} onSelectTab={onSelectTab} tabs={tabs} />
      )}
    </View>
  );
};

const Tabs = ({tabs, activeTab, onSelectTab}: ITabProps) => {
  const {theme} = useTheme();

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tabName, index) => (
        <Pressable
          onPress={() => onSelectTab(tabName)}
          style={[
            styles.tabItem,
            activeTab === tabName && styles.activeTab,
            {borderBottomColor: theme.colors.primary[100]},
          ]}
          key={index}>
          <TextContent
            style={[
              [
                styles.tabName,
                activeTab === tabName && styles.activeTabName,
                {
                  color:
                    activeTab === tabName
                      ? theme.colors.text
                      : theme.colors.disabledText,
                },
              ],
            ]}>
            {tabName}
          </TextContent>
        </Pressable>
      ))}
    </View>
  );
};

Header.Tabs = Tabs;

const styles = StyleSheet.create({
  tabName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  activeTabName: {fontFamily: 'Inter-Bold'},
  activeTab: {
    borderBottomWidth: 2,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    border: 0,
  },
  tabContainer: {
    flexDirection: 'row',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    borderBottomWidth: 1,
  },
  container: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    columnGap: 8,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
