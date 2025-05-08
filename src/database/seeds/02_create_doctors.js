import bcrypt from 'bcrypt';

const hashedPasswordDoctor = await bcrypt.hash('12345', 10);
export async function seed(knex) {
  await knex('doctors').del();
  await knex('doctors').insert([
    { name: 'Jose Perez', email: 'jperez@example.com', password: hashedPasswordDoctor },
    { name: 'Carolina Rivero', email: 'crivero@example.com', password: hashedPasswordDoctor }
  ]);
}