import COLLECTION from '../collections';
import database from '../database';

interface IHistory {
  date: string;
  habits: {
    habitId: string;
    progress?: number | string;
    completed: boolean;
  }[];
}

const getHistoryModel = () =>
  database.getCollection<IHistory>(COLLECTION.HISTORY);

export default getHistoryModel;
