import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {Home} from './src/screens/Home/Home';
import {useTheme} from './ThemeProvider';

function App(): JSX.Element {
  const {theme} = useTheme();

  const backgroundStyle = {
    backgroundColor: theme.colors.background,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'rgba(0,0,0,0)'}
        translucent={true}
      />
      <Home />
    </SafeAreaView>
  );
}

export default App;
