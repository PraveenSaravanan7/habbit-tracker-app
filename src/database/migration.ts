import 'react-native-get-random-values';
import COLLECTION from './collections';
import database from './database';
import {ICategory} from './models/category';
import {v4 as uuid} from 'uuid';

const migration = () => {
  initHabits();
  initCategories();

  database.saveDatabase();
};

const initHabits = () => {
  if (database.getCollection(COLLECTION.HABITS)) return;

  database.addCollection(COLLECTION.HABITS);
};

const initCategories = () => {
  if (database.getCollection(COLLECTION.CATEGORIES)) return;

  const collection = database.addCollection(COLLECTION.CATEGORIES);

  const categories: ICategory[] = [
    {
      id: uuid(),
      icon: 'block-helper',
      name: 'Quit a bad habit',
      color: 'darkred',
    },
    {
      id: uuid(),
      icon: 'brush',
      name: 'Art',
      color: 'crimson',
    },
    {
      id: uuid(),
      icon: 'clock-outline',
      name: 'Task',
      color: 'orangered',
    },
    {
      id: uuid(),
      icon: 'meditation',
      name: 'Meditation',
      color: 'darkorange',
    },
    {
      id: uuid(),
      icon: 'school',
      name: 'Study',
      color: 'goldenrod',
    },
    {
      id: uuid(),
      icon: 'bike',
      name: 'Sports',
      color: 'cornflowerblue',
    },
    {
      id: uuid(),
      icon: 'ticket',
      name: 'Entertainment',
      color: 'dodgerblue',
    },
    {
      id: uuid(),
      icon: 'android-messages',
      name: 'Social',
      color: 'deepskyblue',
    },
    {
      id: uuid(),
      icon: 'piggy-bank',
      name: 'Finance',
      color: 'darkturquoise',
    },
    {
      id: uuid(),
      icon: 'hospital',
      name: 'Health',
      color: 'cadetblue',
    },
    {
      id: uuid(),
      icon: 'briefcase',
      name: 'Work',
      color: 'goldenrod',
    },
    {
      id: uuid(),
      icon: 'silverware-variant',
      name: 'Nutrition',
      color: 'rosybrown',
    },
    {
      id: uuid(),
      icon: 'home',
      name: 'Home',
      color: 'teal',
    },
    {
      id: uuid(),
      icon: 'terrain',
      name: 'Outdoor',
      color: 'yellowgreen',
    },
    {
      id: uuid(),
      icon: 'apps',
      name: 'Other',
      color: 'slateblue',
    },
  ];

  collection.insert(categories);
};

export default migration;
