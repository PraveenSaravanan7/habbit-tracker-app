import COLLECTION from '../collections';
import database from '../database';

interface IHistory {
  date: string;
  progress: {
    habitId: string;
    progress: number;
    completed: boolean;
  }[];
}

const getHistoryModel = () =>
  database.getCollection<IHistory>(COLLECTION.HISTORY);

export default getHistoryModel;
