import { pool } from "../db.js";

class ModelValidationError extends Error {
    constructor(message, details = null) {
        super(message);
        this.name = "ModelValidationError";
        this.status = 400;
        this.details = details;
    }
}

class BaseModel {
    constructor(tableName, columns, options = {}) {
        this.tableName = tableName;
        this.columns = columns;
        this.schema = options.schema || {};
        this.attributes = options.attributes || {};
        this.primaryKey = options.primaryKey || "id";
        this.relations = options.relations || {};
        this.foreignKeys = options.foreignKeys || {};
    }

    isTypeValid(value, type) {
        if (value === null || value === undefined) return true;
        switch (type) {
            case "string":
                return typeof value === "string";
            case "integer":
            case "number":
            case "decimal":
                return typeof value === "number" && !Number.isNaN(value);
            case "boolean":
                return typeof value === "boolean";
            case "date":
                if (value instanceof Date) return !Number.isNaN(value.getTime());
                if (typeof value === "string" || typeof value === "number") {
                    return !Number.isNaN(new Date(value).getTime());
                }
                return false;
            default:
                return true;
        }
    }

    validateData(data, { mode = "update" } = {}) {
        if (!data || typeof data !== "object") {
            throw new ModelValidationError("Payload must be an object", { reason: "payload_not_object" });
        }

        const keys = Object.keys(data);
        if (keys.length === 0 && mode === "create") {
            throw new ModelValidationError("Payload vacío", { reason: "empty_payload" });
        }

        for (const key of keys) {
            if (!this.columns.includes(key)) {
                throw new ModelValidationError(`Campo no permitido: ${key}`, { field: key });
            }

            const expected = this.schema[key];
            if (expected && !this.isTypeValid(data[key], expected)) {
                throw new ModelValidationError(`Tipo inválido para ${key}`, { field: key, expected });
            }
        }
    }

    filterData(data) {
        return Object.fromEntries(Object.entries(data).filter(([key]) => this.columns.includes(key)));
    }

    fillDefaults(data) {
        const result = { ...this.attributes };
        for (const [k, v] of Object.entries(data)) result[k] = v;
        return result;
    }

    async ensureForeignKeys(data) {
        const entries = Object.entries(this.foreignKeys);
        for (const [field, config] of entries) {
            if (!Object.prototype.hasOwnProperty.call(data, field)) continue;
            const value = data[field];
            if (value === null || value === undefined) continue;
            const refColumn = config.refColumn || "id";
            const rows = await config.model.findByColumn(refColumn, value, { attributes: [refColumn] });
            if (!rows || rows.length === 0) {
                throw new ModelValidationError("Llave foránea no existe", {
                    field,
                    value,
                    refTable: config.refTable || config.model?.tableName,
                });
            }
        }
    }

    normalizeInclude(include) {
        if (!include) return [];
        const list = Array.isArray(include) ? include : [include];
        return list
            .map(item => {
                if (typeof item === "string") return { name: item };
                return { ...item };
            })
            .map(item => ({
                name: item.name,
                attributes: item.attributes,
                ...(this.relations[item.name] || {}),
            }))
            .filter(rel => rel.model && rel.foreignKey)
            .map(rel => ({
                ...rel,
                localKey: rel.localKey || this.primaryKey,
                as: rel.as || rel.name,
            }));
    }

    async findByColumn(column, value, options = {}) {
        if (!this.columns.includes(column)) {
            throw new ModelValidationError("Columna no permitida", { column });
        }
        const selected = Array.isArray(options.attributes) && options.attributes.length > 0
            ? options.attributes.filter(attr => this.columns.includes(attr))
            : ["*"];
        const query = `SELECT ${selected.join(", ")} FROM ${this.tableName} WHERE ${column} = $1`;
        const { rows } = await pool.query(query, [value]);
        return rows;
    }

    async attachRelations(rows, include) {
        const relations = this.normalizeInclude(include);
        if (relations.length === 0) return rows;

        return Promise.all(
            rows.map(async row => {
                const enriched = { ...row };
                for (const rel of relations) {
                    if (rel.type === "hasMany") {
                        enriched[rel.as] = await rel.model.findByColumn(rel.foreignKey, row[rel.localKey], {
                            attributes: rel.attributes,
                        });
                    } else if (rel.type === "hasOne") {
                        const related = await rel.model.findByColumn(rel.foreignKey, row[rel.localKey], {
                            attributes: rel.attributes,
                        });
                        enriched[rel.as] = related[0] || null;
                    }
                }
                return enriched;
            })
        );
    }

    async create(data) {
        const payload = this.fillDefaults(this.filterData(data));
        this.validateData(payload, { mode: "create" });
        await this.ensureForeignKeys(payload);

        const keys = Object.keys(payload);
        const values = Object.values(payload);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
        const columnNames = keys.join(", ");

        const query = `INSERT INTO ${this.tableName} (${columnNames}) VALUES (${placeholders}) RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async findAll(options = {}) {
        const query = `SELECT * FROM ${this.tableName}`;
        const { rows } = await pool.query(query);
        if (options.include) {
            return this.attachRelations(rows, options.include);
        }
        return rows;
    }

    async findById(id, options = {}) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        const row = rows[0];
        if (!row) return null;
        if (options.include) {
            const [withRelations] = await this.attachRelations([row], options.include);
            return withRelations;
        }
        return row;
    }

    async update(id, data) {
        const payload = this.filterData(data);
        this.validateData(payload, { mode: "update" });
        await this.ensureForeignKeys(payload);

        const entries = Object.entries(payload);
        if (entries.length === 0) {
            return this.findById(id);
        }

        const setClauses = entries
            .map(([key], i) => `${key} = COALESCE($${i + 1}, ${key})`)
            .join(", ");
        const values = [...Object.values(payload), id];

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async replace(id, data) {
        const payload = this.fillDefaults(this.filterData(data));
        this.validateData(payload, { mode: "replace" });
        await this.ensureForeignKeys(payload);

        const keys = Object.keys(payload);
        const values = Object.values(payload);
        const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${values.length + 1} RETURNING *`;
        const { rows } = await pool.query(query, [...values, id]);
        return rows[0];
    }

    async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

export { ModelValidationError };
export default BaseModel;
