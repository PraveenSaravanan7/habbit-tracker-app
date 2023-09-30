import React from 'react';
import {Modal as RnModal, StyleSheet, View} from 'react-native';
import {useTheme} from '../../ThemeProvider';

export interface IModal {
  isVisible: boolean;
  updateVisibility: (isVisible: boolean) => void;
  children: JSX.Element;
  placeContentAtBottom?: boolean;
  fullWidth?: boolean;
}

export const Modal = ({
  isVisible,
  updateVisibility,
  children,
  placeContentAtBottom,
  fullWidth,
}: IModal) => {
  const {theme} = useTheme();

  if (!isVisible) return null;

  return (
    <RnModal
      statusBarTranslucent
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={() => updateVisibility(false)}>
      <View
        style={[
          styles.centeredView,
          {backgroundColor: theme.colors.transparentBackdrop},
          placeContentAtBottom && styles.placeContentAtBottom,
        ]}>
        <View
          style={[
            styles.modalView,
            {shadowColor: theme.colors.text},
            fullWidth && styles.fullWidth,
          ]}>
          {children}
        </View>
      </View>
    </RnModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    // shadowOffset: {
    //   width: 2,
    // //   height: 2,
    // // },
    // // shadowOpacity: 0.25,
    // // shadowRadius: 4,
    // elevation: 5,
  },
  placeContentAtBottom: {justifyContent: 'flex-end'},
  fullWidth: {width: '100%'},
});
