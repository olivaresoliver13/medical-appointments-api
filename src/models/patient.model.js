import db from "../config/database.js";
import bcrypt from "bcrypt";

class Patient {
  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [id] = await db("patients").insert({
      name,
      email,
      password: hashedPassword,
    });
    return this.findById(id);
  }

  static async findById(id) {
    return db("patients").where({ id }).first();
  }

  static async findByEmail(email) {
    console.log("Looking for patient with email:", email);
    console.log(
      "Generated SQL:",
      db("patients").where({ email }).first().toString()
    );
    return db("patients").where({ email }).first();
  }
}

export default Patient;