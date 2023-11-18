import COLLECTION from '../collections';
import database from '../database';

export interface IHistory extends Partial<LokiObj> {
  date: string;
  habits: {
    habitId: string;
    progress?: number | string | number[];
    completed?: boolean;
  }[];
}

const getHistoryModel = () =>
  database.getCollection<IHistory>(COLLECTION.HISTORY);

export default getHistoryModel;
