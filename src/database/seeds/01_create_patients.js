import bcrypt from 'bcrypt';

const hashedPasswordPatient = await bcrypt.hash('12345', 10);

export async function seed(knex) {
  await knex('patients').del();
  await knex('patients').insert([
    { name: 'Oliver Olivares', email: 'oolivares@example.com', password: hashedPasswordPatient },
    { name: 'Maria Morales', email: 'mmorales@example.com', password: hashedPasswordPatient }
  ]);
}


