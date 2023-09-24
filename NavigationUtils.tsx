import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type TStackScreens = {
  Home: undefined;
  Add: undefined;
  Search: {text: string};
};

export type TStackNavigation = NavigationProp<TStackScreens>;

export const Stack = createNativeStackNavigator<TStackScreens>();

export const useNavigator = () => useNavigation<TStackNavigation>();

export const useRouter = <T extends keyof TStackScreens>() =>
  useRoute<RouteProp<TStackScreens, T>>();
