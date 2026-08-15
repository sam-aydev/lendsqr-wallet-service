"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
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
async function down(knex) {
    await knex.schema.dropTableIfExists("transactions");
    await knex.schema.dropTableIfExists("wallets");
    await knex.schema.dropTableIfExists("users");
}
