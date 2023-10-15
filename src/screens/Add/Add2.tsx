// import React, {useState} from 'react';
// import {ScrollView, StyleSheet, TextInput, View} from 'react-native';
// import {Header} from '../../components/Header';
// import {TextContent} from '../../components/TextContent';
// import {useTheme} from '../../../ThemeProvider';
// import getCategoryModel from '../../database/models/category';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// export const Add = () => {
//   const {theme} = useTheme();

//   const [name, setName] = useState('');

//   const [category, setCategory] = useState(getCategoryModel().findOne());

//   return (
//     <View>
//       <Header title="Add" />
//       <ScrollView contentContainerStyle={[styles.container]}>
//         <View>
//           <View
//             style={[
//               styles.nameTextInputContainer,
//               {borderColor: theme.colors.surface[100]},
//             ]}>
//             <View>
//               <TextContent style={[styles.containerText]}>
//                 Habit name
//               </TextContent>
//             </View>
//             <View>
//               <TextInput
//                 style={[
//                   styles.nameTextInput,
//                   {borderColor: theme.colors.primary[100]},
//                 ]}
//                 autoFocus={true}
//                 onChangeText={text => setName(text)}
//                 defaultValue={name}
//                 cursorColor={theme.colors.surface[500]}
//               />
//             </View>
//           </View>
//           <View
//             style={[
//               styles.item,
//               {borderBottomColor: theme.colors.surface[100]},
//             ]}>
//             <View style={[styles.minorContainer]}>
//               <MaterialCommunityIcons
//                 name="view-grid-outline"
//                 color={theme.colors.primary[100]}
//                 size={24}
//               />
//               <TextContent style={[styles.containerText]}>Category</TextContent>
//             </View>
//             <View style={[styles.minorContainer]}>
//               <TextContent>{category?.name}</TextContent>
//               <View
//                 style={[
//                   styles.categoryIcon,
//                   {backgroundColor: category?.color},
//                 ]}>
//                 <MaterialCommunityIcons
//                   name={category?.icon || ''}
//                   color={'#fff'}
//                   size={20}
//                 />
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {marginTop: 90},
//   nameTextInput: {borderWidth: 2, borderRadius: 8},
//   nameTextInputContainer: {padding: 16, rowGap: 12, borderBottomWidth: 1},
//   containerText: {fontFamily: 'Inter-SemiBold', fontSize: 14},
//   item: {
//     padding: 16,
//     borderBottomWidth: 1,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     flexDirection: 'row',
//   },
//   categoryIcon: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   minorContainer: {flexDirection: 'row', alignItems: 'center', columnGap: 8},
// });
