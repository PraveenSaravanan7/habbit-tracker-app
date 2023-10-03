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

export default database;
