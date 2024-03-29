import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

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

const database = new Database({
  adapter,
  modelClasses: dbModels,
  actionsEnabled: true,
});

AppRegistry.registerComponent(appName, () => App);
