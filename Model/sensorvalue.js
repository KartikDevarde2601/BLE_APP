import {Model} from '@nozbe/watermelondb';
import {
  field,
  action,
  readonly,
  date,
  children,
  relation,
} from '@nozbe/watermelondb/decorators';

export default class Sensorvalue extends Model {
  static table = 'sensorvalues';

  static associations = {
    visits: {type: 'belongs_to', key: 'visit_id'},
  };

  @field('frequency') frequency;
  @field('postGenerator') postGenerator;
  @field('postSensor') postSensor;
  @field('bioImpedance') bioImpedance;
  @field('phaseAngle') phaseAngle;
  @field('stepsize') stepsize;
  @field('numberofpoints') numberofpoints;
  @field(timestamp) timestamp;
  @relation('visits', visit_id) visit;
  @readonly @date('createdAt') createdAt;
  @readonly @date('updatedAt') updatedAt;
}
