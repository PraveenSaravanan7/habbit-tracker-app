import React from 'react';
import {StatusBar} from 'react-native';
import {Home} from './src/screens/Home/Home';
import {useTheme} from './ThemeProvider';
import {NavigationContainer} from '@react-navigation/native';
import {Stack} from './NavigationUtils';
import {Add} from './src/screens/Add/Add';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import database from './src/database/database';
import {HabitInfo} from './src/screens/HabitInfo/HabitInfo';

function App(): JSX.Element {
  const {theme} = useTheme();

  database;

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'rgba(0,0,0,0)'}
        translucent={true}
      />

      <NavigationContainer
        theme={{
          dark: theme.isDark,
          colors: {
            background: theme.colors.background,
            border: theme.colors.background,
            card: theme.colors.background,
            notification: theme.colors.background,
            primary: theme.colors.primary[100],
            text: theme.colors.text,
          },
        }}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'none',
            navigationBarColor: theme.colors.surface[100],
          }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Add" component={Add} />
          <Stack.Screen name="HabitInfo" component={HabitInfo} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
