import glyphmaps from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

export interface ICategory {
  id: string;
  name: string;
  icon: keyof typeof glyphmaps;
  color: string;
  isCustom?: boolean;
}
