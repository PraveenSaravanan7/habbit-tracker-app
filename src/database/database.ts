import loki from 'lokijs';
import adapter from './adapter';
import migration from './migration';

const database = new loki('db.json', {
  env: 'NA',
  autoload: true,
  verbose: true,
  adapter: adapter(),
  autosave: true,
  autosaveInterval: 10000, // 10 sec
  autoloadCallback: () => {
    console.log('--autoloadCallback');
    //Todo: Add migration script

    migration();
  },
});

export enum HABIT_MODEL_EVENT {
  ADD_HABIT = 'add_habit',
}

export enum HISTORY_MODEL_EVENT {
  UPDATE_HISTORY = 'update_history',
}

export const emitDatabaseEvent = (
  event: HABIT_MODEL_EVENT | HISTORY_MODEL_EVENT,
) => {
  try {
    database.emit(event);
  } catch (e) {}
};

export default database;
