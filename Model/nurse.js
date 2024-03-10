//....................LIBRARIES....................
import {Model} from '@nozbe/watermelondb';
import {
  field,
  children,
  readonly,
  date,
  writer,
  action,
} from '@nozbe/watermelondb/decorators';

//....................MODEL....................

export default class Nurse extends Model {
  static table = 'nurses';
  static associations = {
    patients: {type: 'has_many', foreign_key: 'nurse_id'},
  };

  @field('name') name;
  @field('email') email;
  @field('role') role;
  @field('doctorId') doctorId;
  @field('doctorName') doctorName;
  @children('patients') patients;
  @readonly @date('createdAt') createdAt;
  @readonly @date('updatedAt') updatedAt;

  @action async getNurse() {
    return {
      name: this.name,
      email: this.email,
      role: this.role,
      doctorId: this.doctorId,
      doctorName: this.doctorName,
      patients: this.patients,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  @action async updateNurse({name, email, role, doctor_id, doctorName}) {
    return await this.update(nurse => {
      nurse.name = name;
      nurse.email = email;
      nurse.role = role;
      nurse.doctor_id = doctor_id;
      nurse.doctorName = doctorName;
    });
  }

  deleteAllPatient = async () => {
    return await this.patients.deleteAllPermanetly();
  };

  @action async deleteNurse() {
    return await Promise.all([
      this.deleteAllPatient(),
      this.markAsDeleted(),
      this.destroyPermanently(),
    ]);
  }

  @writer async addPatient(
    patientData,
    medicationHistoryData,
    comorbiditiesData,
    visitData,
  ) {
    return await this.collections.get('patients').create(patient => {
      patient.name = patientData.name;
      patient.age = patientData.age;
      patient.gender = patientData.gender;
      patient.race = patientData.race;
      patient.height = patientData.height;
      patient.weight = patientData.weight;
      patient.BMI = patientData.BMI;
      patient.bloodGroup = patientData.bloodGroup;
      patient.email = patientData.email;
      patient.role = patientData.role;
      patient.nurse_id = this.id;
      patient.nurseName = this.name;

      this.collections.get('comorbidities').create(comorbidities => {
        comorbidities.patient_id = patientData._id;
        comorbidities.diabetes = comorbiditiesData.diabetes;
        comorbidities.HTN = comorbiditiesData.HTN;
        comorbidities.asthma = comorbiditiesData.asthma;
        comorbidities.somking = comorbiditiesData.somking;
        comorbidities.alcohol = comorbiditiesData.alcohol;
        comorbidities.kidneyDisease = comorbiditiesData.kidneyDisease;
        comorbidities.pastMI = comorbiditiesData.pastMI;
        comorbidities.pastCVA = comorbiditiesData.pastCVA;
        comorbidities.priorStenting = comorbiditiesData.priorStenting;
        comorbidities.priorCABG = comorbiditiesData.priorCABG;
      });

      this.collections.get('medicationHistory').create(medicationHistory => {
        medicationHistory.patient_id = patientData._id;
        medicationHistory.diuretics = medicationHistoryData.diuretics;
      });

      this.collections.get('visits').create(visit => {
        visit.patient_id = patientData._id;
        visit.date = visitData.date;
      });
    });
  }
}
