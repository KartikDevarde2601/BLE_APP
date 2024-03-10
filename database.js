//.................LIBRARY.......................
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

//.................SCHEMA && MODEL .......................

import {dbModels} from './Model';
import {Myschema} from './Model/Schema';

//.................DATABASE.......................

//.................DATABASE.......................
const adapter = new SQLiteAdapter({
  dbName: 'BiozDatabaseMobile',
  schema: Myschema,

  onSetUpError: error => {
    console.log('onSetUpError', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: dbModels,
  actionsEnabled: true,
});
