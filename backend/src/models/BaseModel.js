import { pool } from "../db.js";

class BaseModel {
    constructor(tableName, columns) {
        this.tableName = tableName;
        this.columns = columns;
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
        const columnNames = keys.join(", ");

        const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async findAll() {
        const query = `SELECT * FROM ${this.tableName}`;
        const { rows } = await pool.query(query);
        return rows;
    }

    async findById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }

    async update(id, data) {
        const entries = Object.entries(data);
        const setClauses = entries
            .map(([key], i) => `${key} = COALESCE($${i + 1}, ${key})`)
            .join(", ");
        const values = [...Object.values(data), id];

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async replace(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClauses = keys
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${
            values.length + 1
        } RETURNING *`;
        const { rows } = await pool.query(query, [...values, id]);
        return rows[0];
    }

    async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

export default BaseModel;
