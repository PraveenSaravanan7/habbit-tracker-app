import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {THabit} from './src/database/models/habit';
import {HABIT_INFO_TAB} from './src/screens/HabitInfo/HabitInfo';
import {ICategory} from './src/database/models/category';

export type TStackScreens = {
  Home: undefined;
  Add: {isTask: boolean};
  Search: {text: string};
  HabitInfo: {habit: THabit; category: ICategory; tab: HABIT_INFO_TAB};
  Archived: undefined;
};

export type TStackNavigation = NavigationProp<TStackScreens>;

export const Stack = createNativeStackNavigator<TStackScreens>();

export const useNavigator = () => useNavigation<TStackNavigation>();

export const useRouter = <T extends keyof TStackScreens>() =>
  useRoute<RouteProp<TStackScreens, T>>();
