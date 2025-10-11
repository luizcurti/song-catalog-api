import {
  ConnectionOptions,
  getConnectionManager,
} from 'typeorm';

import ormconfig from './config/ormconfig';

const configs = {
  LOCAL: ormconfig as ConnectionOptions[],
};

const dataBaseConfigs = configs[process.env.ENV as keyof typeof configs] || (ormconfig as ConnectionOptions[]);

class TypedDatabase {
  async init() {
    const connectionManager = getConnectionManager();
    for (const dataBaseConfig of dataBaseConfigs) {
      try {
        const connection = connectionManager.create(dataBaseConfig);

        await connection.connect();
        
        console.log( `[DATABASE] ${dataBaseConfig.name} CONNECTED` );
      } catch (error) {
        console.log( `[DATABASE] ${dataBaseConfig.name} ERROR`, error );
      }
    }
  }
}

export default new TypedDatabase();
