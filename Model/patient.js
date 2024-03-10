//................LIBRARIES.....................
import {Model} from '@nozbe/watermelondb';
import {
  relation,
  field,
  children,
  action,
  readonly,
  date,
  immutableRelation,
} from '@nozbe/watermelondb/decorators';

export default class Patient extends Model {
  static table = 'patients';

  static associations = {
    nurses: {type: 'belongs_to', key: 'nurse_id'},
    comorbidities: {type: 'belongs_to', foreign_key: 'comorbiditie_id'},
    medicalrecords: {type: 'belongs_to', foreign_key: 'medicalrecord_id'},
    visits: {type: 'has_many', foreign_key: 'visit_id'},
  };

  @field('name') name;
  @field('age') age;
  @field('gender') gender;
  @field('race') race;
  @field('height') height;
  @field('weight') weight;
  @field('BMI') BMI;
  @field('bloodGroup') bloodGroup;
  @field('email') email;
  @field('role') role;
  @field('nurseName') nurseName;
  @relation('nurse', 'nurse_id') nurse;
  @children('comorbidities') comorbidities;
  @children('medicalrecords') medicalrecords;
  @children('visits') visits;
  @readonly @date('createdAt') createdAt;
  @readonly @date('updatedAt') updatedAt;
}
