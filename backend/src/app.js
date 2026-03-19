import express from 'express';
import cors from 'cors';

import productosRoutes from './routes/productos.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);

export default app;