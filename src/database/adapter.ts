import fs from 'react-native-fs';

const adapter = () => {
  const config: LokiPersistenceAdapter = {
    loadDatabase: async (dbName, callback) => {
      try {
        const dbPath = fs.DocumentDirectoryPath + '/' + dbName;

        const fileInfo = await fs.stat(dbPath);

        if (!fileInfo.isFile()) return;

        const data = await fs.readFile(dbPath, {
          encoding: 'utf8',
        });

        console.log('--loadDatabase');

        callback(data);
      } catch (err) {
        callback(err);
      }
    },
    saveDatabase: async (dbName, dbString, callback) => {
      try {
        const dbPath = fs.DocumentDirectoryPath + '/' + dbName;

        console.log('--saveDatabase');

        await fs.writeFile(dbPath, dbString);

        callback();
      } catch (err) {
        callback(err as any);
      }
    },
    deleteDatabase: async (dbName, callback) => {
      try {
        const dbPath = fs.DocumentDirectoryPath + '/' + dbName;

        console.log('--deleteDatabase');

        await fs.unlink(dbPath);

        callback();
      } catch (err) {
        callback(err as any);
      }
    },
  };

  return config;
};

export default adapter;
