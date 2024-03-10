import {Model} from '@nozbe/watermelondb';

import {
  field,
  action,
  readonly,
  date,
  relation,
} from '@nozbe/watermelondb/decorators';

export default class Comorbidities extends Model {
  static table = 'comorbidities';

  static associations = {
    patients: {type: 'belongs_to', key: 'patient_id'},
  };

  @field('patient_id') patient_id;
  @field('diabetes') diabetes;
  @field('HTN') HTN;
  @field('asthma') asthma;
  @field('smoking') smoking;
  @field('alcohol') alcohol;
  @field('kidneyDisease') kidneyDisease;
  @field('pastMI') pastMI;
  @field('pastCVA') pastCVA;
  @field('priorStenting') priorStenting;
  @field('priorCABG') priorCABG;
  @relation('patients', 'patient_id') patient;
  @readonly @date('createdAt') createdAt;
  @readonly @data('updatedAt') updatedAt;

  @action async updateComorbidities({
    diabetes,
    HTN,
    asthma,
    smoking,
    alcohol,
    kidneyDisease,
    pastMI,
    pastCVA,
    priorStenting,
    priorCABG,
  }) {
    return await this.update(comorbidities => {
      comorbidities.diabetes = diabetes;
      comorbidities.HTN = HTN;
      comorbidities.asthma = asthma;
      comorbidities.smoking = smoking;
      comorbidities.alcohol = alcohol;
      comorbidities.kidneyDisease = kidneyDisease;
      comorbidities.pastMI = pastMI;
      comorbidities.pastCVA = pastCVA;
      comorbidities.priorStenting = priorStenting;
      comorbidities.priorCABG = priorCABG;
    });
  }
}
