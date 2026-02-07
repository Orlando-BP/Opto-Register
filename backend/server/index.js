import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io'
import { createServer } from 'node:http';
import { join } from 'node:path'; // <-- agregado

const port = process.env.PORT || 3000;
const app = express();

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(logger('dev'));

app.disable('etag');
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Servir archivos estáticos del admin (permitirá /CSS/... y /JS/...)
app.use(express.static(join(process.cwd(), 'Codigo Web', 'admin'))); // <-- agregado

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/Codigo Web/admin/index.html');
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
