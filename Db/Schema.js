//......................LIBRARY.....................
import {appSchema, tableSchema} from '@nozbe/watermelondb';

//......................TABLE SCHEMA.....................
//TODO: add more table schema DOCTOR, ADMIN

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'nurses',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'role', type: 'string'},
        {name: 'doctorId', type: 'string'},
        {name: 'doctorName', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'patients',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'age', type: 'number'},
        {name: 'gender', type: 'string'},
        {name: 'race', type: 'string'},
        {name: 'height', type: 'number'},
        {name: 'weight', type: 'number'},
        {name: 'BMI', type: 'number'},
        {name: bloodGroup, type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'role', type: 'string'},
        {name: 'nurse_id', type: 'string', isIndexed: true},
        {name: 'nurseName', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'comorbidities',
      columns: [
        {name: 'patient_id', type: 'string', isIndexed: true},
        {name: 'diabetes', type: 'boolean'},
        {name: 'HTN', type: 'boolean'},
        {name: 'asthma', type: 'boolean'},
        {name: 'somking:', type: 'boolean'},
        {name: 'alcohol', type: 'boolean'},
        {name: 'kidneyDisease', type: 'boolean'},
        {name: 'pastMI', type: 'boolean'},
        {name: 'pastCVA', type: 'boolean'},
        {name: 'priorStenting', type: 'boolean'},
        {name: 'priorCABG', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'medicalrecords',
      columns: [
        {name: 'patient_id', type: 'string', isIndexed: true},
        {name: 'diuretics', type: 'boolean'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'visits',
      columns: [
        {name: 'patient_id', type: 'string', isIndexed: true},
        {name: 'visit_id', type: 'string'},
        {name: 'visitDate', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'sensorvalues',
      columns: [
        {name: 'visit_id', type: 'string', isIndexed: true},
        {name: 'frequency', type: 'number'},
        {name: 'postGenerator', type: 'number'},
        {name: 'postSensor', type: 'number'},
        {name: 'bioImpedance', type: 'number'},
        {name: 'phaseAngle', type: 'number'},
        {name: 'stepsize', type: 'number'},
        {name: 'numberOfpoints', type: 'number'},
        {name: 'timestamp', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
      ],
    }),
  ],
});
