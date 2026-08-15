import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("email").unique().notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("wallets", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.string("last_name").notNullable();
    table.decimal("balance", 15, 2).defaultTo(0.0).notNullable();
    table.timestamps(true, true);
  });

  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table
      .uuid("wallet_id")
      .references("id")
      .inTable("wallets")
      .onDelete("CASCADE");
    table.enum("type", ["CREDIT", "DEBIT", "TRANSFER"]).notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("reference").unique().notNullable();
    table.enum("status", ["PENDING", "SUCCESS", "FAILED"]).defaultTo("PENDING");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("wallets");
  await knex.schema.dropTableIfExists("users");
}
