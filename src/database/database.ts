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
    migration();
    emitDatabaseEvent(DATABASE_EVENTS.STARTED);
  },
});

export enum DATABASE_EVENTS {
  STARTED = 'started',
}

export enum HABIT_MODEL_EVENT {
  ADD_HABIT = 'add_habit',
  UPDATE_HABIT = 'update_habit',
  UPDATED_SINGLE_TASK = 'update_single_task',
}

export enum HISTORY_MODEL_EVENT {
  UPDATE_HISTORY = 'update_history',
}

export const emitDatabaseEvent = (
  event: DATABASE_EVENTS | HABIT_MODEL_EVENT | HISTORY_MODEL_EVENT,
) => {
  try {
    database.emit(event);
  } catch (e) {}
};

export default database;
