import { Sequelize } from "sequelize";

const db = new Sequelize("simara_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    timezone: "Asia/Jakarta", // Set timezone here
  },
  timezone: "Asia/Jakarta", // Ensure the ORM uses the correct timezone
});

export default db;
