import db from "../config/database.js";
import bcrypt from "bcrypt";

class Doctor {
  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [id] = await db("doctors").insert({
      name,
      email,
      password: hashedPassword,
    });
    return this.findById(id);
  }

  static async findById(id) {
    return db("doctors").where({ id }).first();
  }

  static async findByEmail(email) {
    return db("doctors").where({ email }).first();
  }
}

export default Doctor;