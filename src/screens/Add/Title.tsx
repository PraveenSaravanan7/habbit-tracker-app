import React from 'react';
import {useTheme} from '../../../ThemeProvider';
import {TextContent} from '../../components/TextContent';
import {StyleSheet} from 'react-native';

export const Title = ({title}: {title: string}) => {
  const {theme} = useTheme();

  return (
    <TextContent style={[styles.title, {color: theme.colors.primary[100]}]}>
      {title}
    </TextContent>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    padding: 16,
    marginBottom: 16,
  },
});
