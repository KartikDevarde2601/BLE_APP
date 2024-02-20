//.................LIBRARY.......................
import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

//.................SCHEMA && MODEL .......................

import schema from './Schema';
import Patient from './Model/patient';
import Nurse from './Model/nurse';
import Visit from './Model/visit';
import Comorbidities from './Model/comorbidies';
import Medicalrecord from './Model/medicalrecord';
import Sensorvalue from './Model/sensorvalue';

//.................DATABASE.......................
const adapter = new SQLiteAdapter({
  dbName: 'BiozDatabaseMobile',
  schema,
});

const database = new Database({
  adapter,
  modelClasses: [
    Patient,
    Nurse,
    Visit,
    Comorbidities,
    Medicalrecord,
    Sensorvalue,
  ],
  actionsEnabled: true,
});

export {database};
