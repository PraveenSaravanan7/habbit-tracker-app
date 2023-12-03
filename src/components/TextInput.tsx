import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput as RnTextInput,
  Text,
  StyleSheet,
  Animated,
  Easing,
  KeyboardTypeOptions,
} from 'react-native';
import {useTheme} from '../../ThemeProvider';

interface ITextInputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  // icon?: string | null;
  error?: boolean;
  errorMessage?: string;
  autoFocus?: boolean;
  labelBackgroundColor?: string;
  keyboardType?: KeyboardTypeOptions;
  flex?: number;
  maxLength?: number;
}

export const TextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  //   icon = null,
  error = false,
  errorMessage = '',
  autoFocus = false,
  labelBackgroundColor,
  keyboardType,
  flex,
  maxLength,
}: ITextInputProps) => {
  const {theme} = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const labelPosition = useRef(
    new Animated.Value(isFocused || value ? 1 : 0),
  ).current;

  const moveLabel = useCallback(() => {
    Animated.timing(labelPosition, {
      toValue: isFocused || value ? 1 : 0,
      duration: 50,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isFocused, labelPosition, value]);

  const labelColor = isFocused
    ? theme.colors.primary[100]
    : theme.colors.disabledText;

  const borderColor = isFocused
    ? theme.colors.primary[100]
    : theme.colors.disabledText;

  const handleOnChangeText = (text: string) => {
    onChangeText(text);
    moveLabel();
  };

  useEffect(() => {
    moveLabel();
  }, [isFocused, moveLabel]);

  return (
    <View style={[styles.wrapper, {flex}]}>
      <Animated.Text
        style={[
          styles.label,
          {
            color: labelColor,
            backgroundColor: labelBackgroundColor || theme.colors.background,
            zIndex: labelPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            fontSize: labelPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [14, 12],
            }),
            transform: [
              {
                translateY: labelPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, -8],
                }),
              },
              {
                translateX: labelPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, 12],
                }),
              },
            ],
          },
        ]}>
        {label}
      </Animated.Text>
      <View style={[styles.container, {borderColor}]}>
        <View style={[styles.inputContainer, error ? styles.inputError : {}]}>
          {/* {icon && (
          <Icon
            name={icon}
            type="material"
            size={24}
            color={isFocused || value ? '#007BFF' : '#A9A9A9'}
          />
        )} */}
          <RnTextInput
            maxLength={maxLength}
            cursorColor={theme.colors.primary[100]}
            style={styles.input}
            placeholder={placeholder}
            defaultValue={value}
            onChangeText={handleOnChangeText}
            secureTextEntry={secureTextEntry}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoFocus={autoFocus}
            keyboardType={keyboardType}
          />
        </View>
        {error && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {marginTop: 0},
  container: {
    // marginBottom: 20,
    borderWidth: 1.8,
    borderColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 8,
    // backgroundColor: 'green',
  },
  label: {
    alignSelf: 'flex-start',
    lineHeight: 14,
    fontFamily: 'Inter-Medium',
    position: 'absolute',
    // zIndex: 1,
    paddingHorizontal: 8,
  },
  labelActive: {
    color: '#007BFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    fontFamily: 'Inter-Medium',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
});
