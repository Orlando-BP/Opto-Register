import {pool} from "../db.js";

class Clients{
	constructor(){
		this.create = this.create.bind(this);
		this.readAll = this.readAll.bind(this);
		this.readOne = this.readOne.bind(this);
		this.update = this.update.bind(this);
		this.replace = this.replace.bind(this);
		this.delete = this.delete.bind(this);
	}

	async create(req, res){
		try{
			const data = req.body;
			const { rows } = await pool.query(
				"INSERT INTO Clients (name, phone, email, address) VALUES ($1, $2, $3, $4) RETURNING *",
				[data.name, data.phone, data.email, data.address]
			);
			res.status(201).json(rows[0]);
		}catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async readAll(req, res){
		try{
			const { rows } = await pool.query("SELECT * FROM Clients");
			res.json(rows);
		}catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async readOne(req, res){
		try{
			const { id } = req.params;
			const { rows } = await pool.query("SELECT * FROM Clients WHERE id = $1", [id]);
			if (rows.length === 0)
				return res.status(404).json({ message: "Usuario no encontrado" });
			res.json(rows[0]);
		}catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async update(req, res){
		try{
			const {id} = req.params;
			const data = req.body;
			const {rows} = await pool.query(
				"UPDATE Clients SET name = COALESCE($1, name), phone = COALESCE($2, phone), email = COALESCE($3, email), address = COALESCE($4, address) WHERE id = $5 RETURNING *",
				[data.name, data.phone, data.email, data.address, id]
			);
			res.json(rows[0]);
		}
		catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async replace(req, res){
		try{
		const {id} = req.params;
			const data = req.body;
			const {rows} = await pool.query(
				"UPDATE Clients SET name = $1, phone = $2, email = $3, address = $4 WHERE id = $5 RETURNING *",
				[data.name, data.phone, data.email, data.address, id]
			);
			res.json(rows[0]);
		}catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}

	async delete(req, res){
		try{

			const { id } = req.params;
			const { rows } = await pool.query("DELETE FROM Clients WHERE id = $1 RETURNING *", [id]);
			if (rows.length === 0)
				return res.status(404).json({ message: "Usuario no encontrado" });
			return res.sendStatus(204);
		}
		catch (error){
			console.error(error);
			res.status(500).json({ message: "Internal server error" });
		}
	}
}

export default new Clients