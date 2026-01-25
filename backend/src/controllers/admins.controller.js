import AdminsService from "../services/admins.service.js";
import jwt from "jsonwebtoken";
import { ModelValidationError } from "../BaseModel.js";

class Admins {
	constructor() {
		this.create = this.create.bind(this);
		this.readAll = this.readAll.bind(this);
		this.readOne = this.readOne.bind(this);
		this.login = this.login.bind(this);
		this.verifyPassword = this.verifyPassword.bind(this);
		this.update = this.update.bind(this);
		this.replace = this.replace.bind(this);
		this.delete = this.delete.bind(this);
	}

	async create(req, res) {
		try {
			const data = { ...req.body };
			const result = await AdminsService.create(data);
			const { password, ...safe } = result;
			res.status(201).json({ status: "201", message: "Created", data: safe });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async readAll(req, res) {
		try {
			const filters = req.body && typeof req.body === "object" ? req.body : {};
			const results = await AdminsService.findAllByWhere(filters);
			const safe = results.map(r => {
				const { password, ...rest } = r;
				return rest;
			});
			res.json({ status: "200", message: "OK", data: safe });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async readOne(req, res) {
		try {
			const { id } = req.params;
			const filters = req.body && typeof req.body === "object" ? req.body : {};
			const hasFilters = Object.keys(filters).length > 0;
			let result = null;
			if (hasFilters) {
				result = await AdminsService.findOneByWhere(filters);
			} else {
				result = await AdminsService.findById(id);
			}
			if (!result)
				return res
					.status(404)
					.json({ status: "404", message: "Administrador no encontrado", data: null });
			const { password, ...safe } = result;
			res.json({ status: "200", message: "OK", data: safe });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async login(req, res) {
		try {
			const { username, password } = req.body;
			if (!username || !password)
				return res.status(400).json({ status: "400", message: "username and password required", data: null });
			const user = await AdminsService.authenticate(username, password);
			if (!user) return res.status(401).json({ status: "401", message: "Invalid credentials", data: null });
			const { password: _pw, ...safeUser } = user;

			// Generar token JWT
			const secret = process.env.JWT_SECRET || "TetoPear";
			const token = jwt.sign({ id: safeUser.id, username: safeUser.username }, secret, {
				expiresIn: "1h",
			});

			res.json({
				status: "200",
				message: "Login successful",
				data: { token, user: safeUser },
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async verifyPassword(req, res) {
		try {
			const { id } = req.params;
			const { password } = req.body;
			if (!password) return res.status(400).json({ status: "400", message: "password required", data: null });
			const { user, match } = await AdminsService.verifyPassword(id, password);
			if (!user) return res.status(404).json({ status: "404", message: "Administrador no encontrado", data: null });
			if (match) return res.status(200).json({ status: "200", message: "Password OK", data: null });
			return res.status(401).json({ status: "401", message: "Invalid credentials", data: null });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const data = req.body;
			const result = await AdminsService.update(id, data);
			const { password: pw, ...safeRes } = result || {};
			res.json({ status: "200", message: "Updated", data: safeRes });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async replace(req, res) {
		try {
			const { id } = req.params;
			const data = req.body;
			const result = await AdminsService.replace(id, data);
			const { password: pw2, ...safeRes2 } = result || {};
			res.json({ status: "200", message: "Replaced", data: safeRes2 });
		} catch (error) {
			console.error(error);
			if (error instanceof ModelValidationError || error?.name === "ModelValidationError") {
				return res.status(400).json({ status: "400", message: error.message, data: error.details ?? null });
			}
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}

	async delete(req, res) {
		try {
			const { id } = req.params;
			const result = await AdminsService.delete(id);
			if (!result)
				return res
					.status(404)
					.json({ status: "404", message: "Administrador no encontrado", data: null });
			return res.status(200).json({ status: "200", message: "Deleted", data: null });
		} catch (error) {
			console.error(error);
			res.status(500).json({ status: "500", message: "Internal server error", data: null });
		}
	}
}

export default new Admins();
