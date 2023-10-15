import glyphmaps from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import database from '../database';
import COLLECTION from '../collections';

export interface ICategory extends Partial<LokiObj> {
  id: string;
  name: string;
  icon: keyof typeof glyphmaps;
  color: string;
  isCustom?: boolean;
}

const getCategoryModel = () =>
  database.getCollection<ICategory>(COLLECTION.CATEGORIES);

export default getCategoryModel;
