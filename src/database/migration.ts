import 'react-native-get-random-values';
import COLLECTION from './collections';
import database from './database';
import {ICategory} from './models/category';
import {v4 as uuid} from 'uuid';
import {commonColors} from '../../themes';

const migration = () => {
  console.log('-- running data migration');
  initHabits();
  initCategories();

  database.saveDatabase();
};

const initHabits = () => {
  if (database.getCollection(COLLECTION.HABITS)) return;

  database.addCollection(COLLECTION.HABITS);
};

const initCategories = () => {
  console.log('init', database.getCollection(COLLECTION.CATEGORIES));
  if (database.getCollection(COLLECTION.CATEGORIES)) return;

  const collection = database.addCollection(COLLECTION.CATEGORIES);

  const categories: ICategory[] = [
    {
      id: uuid(),
      icon: 'block-helper',
      name: 'Quit a bad habit',
      color: commonColors.salmon,
    },
    {
      id: uuid(),
      icon: 'brush',
      name: 'Art',
      color: commonColors.cerise,
    },
    {
      id: uuid(),
      icon: 'clock-outline',
      name: 'Task',
      color: commonColors.fuchsia,
    },
    {
      id: uuid(),
      icon: 'meditation',
      name: 'Meditation',
      color: commonColors.blueViolet,
    },
    {
      id: uuid(),
      icon: 'school',
      name: 'Study',
      color: commonColors.royalBlue,
    },
    {
      id: uuid(),
      icon: 'bike',
      name: 'Sports',
      color: commonColors.azure,
    },
    {
      id: uuid(),
      icon: 'ticket',
      name: 'Entertainment',
      color: commonColors.teal,
    },
    {
      id: uuid(),
      icon: 'android-messages',
      name: 'Social',
      color: commonColors.seaGreen,
    },
    {
      id: uuid(),
      icon: 'piggy-bank',
      name: 'Finance',
      color: commonColors.shamrockGreen,
    },
    {
      id: uuid(),
      icon: 'hospital',
      name: 'Health',
      color: commonColors.green,
    },
    {
      id: uuid(),
      icon: 'briefcase',
      name: 'Work',
      color: commonColors.oliveGreen,
    },
    {
      id: uuid(),
      icon: 'silverware-variant',
      name: 'Nutrition',
      color: commonColors.mustard,
    },
    {
      id: uuid(),
      icon: 'home',
      name: 'Home',
      color: commonColors.orange,
    },
    {
      id: uuid(),
      icon: 'terrain',
      name: 'Outdoor',
      color: commonColors.redOrange,
    },
    {
      id: uuid(),
      icon: 'apps',
      name: 'Other',
      color: commonColors.rust,
    },
  ];

  collection.insert(categories);
};

export default migration;
