import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: "./src/database/seeds",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};

export default config;
