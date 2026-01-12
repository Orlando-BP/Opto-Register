import express from 'express';
import { PORT } from './config.js';
import mainRoutes from './routes/clients.routes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(mainRoutes);


// app.get('/health', (_, res) => {
// 	res.json({ status: 'OK' });
// });

app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
