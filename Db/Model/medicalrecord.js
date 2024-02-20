import {Model} from '@nozbe/watermelondb';
import {
  field,
  action,
  readonly,
  date,
  relation,
} from '@nozbe/watermelondb/decorators';

export default class Medicalrecord extends Model {
  static table = 'medicalrecords';

  static associations = {
    patients: {type: 'belongs_to', key: 'patient_id'},
  };

  @field('patient_id') patient_id;
  @field('diuretics') diuretics;
  @relation('patients', 'patient_id') patient;
  @readonly @data('createdAt') createdAt;
  @readonly @data('updatedAt') updatedAt;

  @action async updateMedicalHistory({diuretics}) {
    return await this.update(medicalHistory => {
      medicalHistory.diuretics = diuretics;
    });
  }
}
