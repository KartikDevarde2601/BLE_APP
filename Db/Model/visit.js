import {Model} from '@nozbe/watermelondb';
import {
  field,
  action,
  readonly,
  date,
  children,
  relation,
} from '@nozbe/watermelondb/decorators';

export default class Visit extends Model {
  static table = 'visits';

  static associations = {
    patients: {type: 'belongs_to', key: 'patient_id'},
    sensorvalues: {type: 'has_many', foreign_key: 'visit_id'},
  };

  @field('patient_id') patient_id;
  @field('visitDate') visitDate;
  @children('sensorvalues') sensorvalues;
  @relation('patients', 'patient_id') patient;
  @readonly @date('createdAt') createdAt;
  @readonly @date('updatedAt') updatedAt;

  @action async updateVisit({visitDate}) {
    return await this.update(visit => {
      visit.visitDate = visitDate;
    });
  }
}
