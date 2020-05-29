import Appointment from '../infra/typeorm/entities/Appointment';

interface AppointmentsRepository {
  findByDate(date: Date): Promise<Appointment | undefined>;
}
