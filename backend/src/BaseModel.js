import { pool } from "./db.js";

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

    resolveModel(modelRef) {
        if (typeof modelRef === "function") {
            return modelRef();
        }
        return modelRef;
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
                if (value instanceof Date)
                    return !Number.isNaN(value.getTime());
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
            throw new ModelValidationError("Payload must be an object", {
                reason: "payload_not_object",
            });
        }

        const keys = Object.keys(data);
        if (keys.length === 0 && mode === "create") {
            throw new ModelValidationError("Payload vacío", {
                reason: "empty_payload",
            });
        }

        for (const key of keys) {
            if (!this.columns.includes(key)) {
                throw new ModelValidationError(`Campo no permitido: ${key}`, {
                    field: key,
                });
            }

            const expected = this.schema[key];
            if (expected && !this.isTypeValid(data[key], expected)) {
                throw new ModelValidationError(`Tipo inválido para ${key}`, {
                    field: key,
                    expected,
                });
            }
        }
    }

    filterData(data) {
        return Object.fromEntries(
            Object.entries(data).filter(([key]) => this.columns.includes(key)),
        );
    }

    fillDefaults(data) {
        const result = { ...this.attributes };
        for (const [k, v] of Object.entries(data)) result[k] = v;
        return result;
    }

    buildWhereClause(data) {
        if (!data || typeof data !== "object") return { clause: "", values: [] };
        const filtered = this.filterData(data);
        this.validateData(filtered, { mode: "filter" });

        const entries = Object.entries(filtered).filter(([, value]) => value !== undefined);
        if (entries.length === 0) return { clause: "", values: [] };

        const values = [];
        const clauses = [];
        let index = 1;

        for (const [key, value] of entries) {
            if (value === null) {
                clauses.push(`${key} IS NULL`);
                continue;
            }
            clauses.push(`${key} = $${index}`);
            values.push(value);
            index += 1;
        }

        return { clause: `WHERE ${clauses.join(" AND ")}`, values };
    }

    // Similar a buildWhereClause pero añade por defecto filtro de soft-delete
    buildWhereClauseWithDelete(data, { includeDeleted = false } = {}) {
        const filtered = this.filterData(data || {});
        this.validateData(filtered, { mode: "filter" });

        const entries = Object.entries(filtered).filter(
            ([, value]) => value !== undefined,
        );
        const values = [];
        const clauses = [];
        let index = 1;

        for (const [key, value] of entries) {
            if (value === null) {
                clauses.push(`${key} IS NULL`);
                continue;
            }
            clauses.push(`${key} = $${index}`);
            values.push(value);
            index += 1;
        }

        if (!includeDeleted) {
            if (
                this.columns.includes("is_deleted") &&
                !Object.prototype.hasOwnProperty.call(filtered, "is_deleted")
            ) {
                clauses.push(`COALESCE(is_deleted, false) = false`);
            }
        }

        if (clauses.length === 0) return { clause: "", values: [] };
        return { clause: `WHERE ${clauses.join(" AND ")}`, values };
    }

    normalizeId(id) {
        const expected = this.schema[this.primaryKey];
        if (expected === "number" || expected === "integer") {
            const numericId = Number(id);
            if (Number.isNaN(numericId)) {
                throw new ModelValidationError(
                    `ID inválido para ${this.tableName}`,
                    {
                        field: this.primaryKey,
                        expected,
                    },
                );
            }
            return numericId;
        }
        return id;
    }

    async ensureForeignKeys(data) {
        const entries = Object.entries(this.foreignKeys);
        for (const [field, config] of entries) {
            if (!Object.prototype.hasOwnProperty.call(data, field)) continue;
            const value = data[field];
            if (value === null || value === undefined) continue;
            const refColumn = config.refColumn || "id";
            const model = this.resolveModel(config.model);
            if (!model) continue;
            const rows = await model.findByColumn(refColumn, value, {
                attributes: [refColumn],
            });
            if (!rows || rows.length === 0) {
                const refTable =
                    config.refTable || model?.tableName || "tabla referenciada";
                throw new ModelValidationError(
                    `Llave foránea no existe: ${field} -> ${refTable}.${refColumn}`,
                    {
                        field,
                        value,
                        refTable,
                        refColumn,
                    },
                );
            }
        }
    }

    normalizeInclude(include) {
        if (!include) return [];
        const list = Array.isArray(include) ? include : [include];
        return list
            .map((item) => {
                if (typeof item === "string") return { name: item };
                return { ...item };
            })
            .map((item) => ({
                name: item.name,
                attributes: item.attributes,
                ...(this.relations[item.name] || {}),
            }))
            .map((rel) => ({
                ...rel,
                model: this.resolveModel(rel.model),
            }))
            .filter((rel) => rel.model && rel.foreignKey)
            .map((rel) => ({
                ...rel,
                localKey: rel.localKey || this.primaryKey,
                as: rel.as || rel.name,
            }));
    }

    async findByColumn(column, value, options = {}) {
        if (!this.columns.includes(column)) {
            throw new ModelValidationError("Columna no permitida", { column });
        }
        const selected =
            Array.isArray(options.attributes) && options.attributes.length > 0
                ? options.attributes.filter((attr) =>
                      this.columns.includes(attr),
                  )
                : ["*"];
        const { clause, values } = this.buildWhereClauseWithDelete(
            { [column]: value },
            options,
        );
        const query = `SELECT ${selected.join(", ")} FROM ${this.tableName} ${clause}`;
        const { rows } = await pool.query(query, values);
        return rows;
    }

    async attachRelations(rows, include) {
        const relations = this.normalizeInclude(include);
        if (relations.length === 0) return rows;

        return Promise.all(
            rows.map(async (row) => {
                const enriched = { ...row };
                for (const rel of relations) {
                    if (rel.type === "hasMany") {
                        enriched[rel.as] = await rel.model.findByColumn(
                            rel.foreignKey,
                            row[rel.localKey],
                            {
                                attributes: rel.attributes,
                            },
                        );
                    } else if (rel.type === "hasOne") {
                        const related = await rel.model.findByColumn(
                            rel.foreignKey,
                            row[rel.localKey],
                            {
                                attributes: rel.attributes,
                            },
                        );
                        enriched[rel.as] = related[0] || null;
                    }
                }
                return enriched;
            }),
        );
    }

    async create(data) {
        const payload = this.fillDefaults(this.filterData(data));
        if (payload.is_deleted === undefined) {
            payload.is_deleted = false;
        }
        if (
            payload[this.primaryKey] === null ||
            payload[this.primaryKey] === undefined
        ) {
            delete payload[this.primaryKey];
        }
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
        const { clause, values } = this.buildWhereClauseWithDelete(
            options.where,
            options,
        );
        const query = `SELECT * FROM ${this.tableName} ${clause}`;
        const { rows } = await pool.query(query, values);
        if (options.include) {
            return this.attachRelations(rows, options.include);
        }
        return rows;
    }

    async findOne(where = {}, options = {}) {
        const { clause, values } = this.buildWhereClauseWithDelete(
            where,
            options,
        );
        const query = `SELECT * FROM ${this.tableName} ${clause} LIMIT 1`;
        const { rows } = await pool.query(query, values);
        const row = rows[0] || null;
        if (!row) return null;
        if (options.include) {
            const [withRelations] = await this.attachRelations(
                [row],
                options.include,
            );
            return withRelations;
        }
        return row;
    }

    async findById(id, options = {}) {
        const normalizedId = this.normalizeId(id);
        const { clause, values } = this.buildWhereClauseWithDelete(
            { [this.primaryKey]: normalizedId },
            options,
        );
        const query = `SELECT * FROM ${this.tableName} ${clause} LIMIT 1`;
        const { rows } = await pool.query(query, values);
        const row = rows[0] || null;
        if (!row) return null;
        if (options.include) {
            const [withRelations] = await this.attachRelations(
                [row],
                options.include,
            );
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
        const normalizedId = this.normalizeId(id);
        const values = [...Object.values(payload), normalizedId];

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${values.length} RETURNING *`;
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async replace(id, data) {
        const payload = this.fillDefaults(this.filterData(data));
        if (
            payload[this.primaryKey] === null ||
            payload[this.primaryKey] === undefined
        ) {
            delete payload[this.primaryKey];
        }
        this.validateData(payload, { mode: "replace" });
        await this.ensureForeignKeys(payload);

        const keys = Object.keys(payload);
        const values = Object.values(payload);
        const setClauses = keys
            .map((key, i) => `${key} = $${i + 1}`)
            .join(", ");

        const query = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${values.length + 1} RETURNING *`;
        const normalizedId = this.normalizeId(id);
        const { rows } = await pool.query(query, [...values, normalizedId]);
        return rows[0];
    }

    async delete(id) {
        const normalizedId = this.normalizeId(id);
        const query = `UPDATE ${this.tableName} SET is_deleted = true WHERE id = $1 RETURNING *`;
        const { rows } = await pool.query(query, [normalizedId]);
        return rows[0];
    }
}

export { ModelValidationError };
export default BaseModel;
