require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Servir la carpeta uploads de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const config = require('./config/config');
const db = require('./config/db');

app.use(cors());
app.use(express.json());

// Rutas base
app.get('/', (req, res) => {
  res.json({ message: 'Billing System API' });
});

// Rutas públicas (sin autenticación)
app.use('/api/public', require('./routes/public.routes'));

// Importar rutas de usuario
const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// Importar rutas de clientes
const clientRoutes = require('./routes/client.routes');
app.use('/api/clients', clientRoutes);

// Importar rutas de productos
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// Importar rutas de ventas
const saleRoutes = require('./routes/sale.routes');
app.use('/api/sales', saleRoutes);

// Importar rutas de compras
const purchaseRoutes = require('./routes/purchase.routes');
app.use('/api/purchases', purchaseRoutes);

// Importar rutas de cotizaciones
const quoteRoutes = require('./routes/quote.routes');
app.use('/api/quotes', quoteRoutes);

// Importar rutas de facturas
const invoiceRoutes = require('./routes/invoice.routes');
app.use('/api/invoices', invoiceRoutes);

// Importar rutas de business_info
const businessInfoRoutes = require('./routes/business_info.routes');
app.use('/api/business', businessInfoRoutes);

// Importar rutas de suppliers
const supplierRoutes = require('./routes/supplier.routes');
app.use('/api/suppliers', supplierRoutes);

// Importar rutas de categories

// Importar y montar rutas de prueba de email
const testRoutes = require('./routes/test.routes')
app.use('/api/test', testRoutes)

const categoryRoutes = require('./routes/category.routes');
app.use('/api/categories', categoryRoutes);

// Importar rutas de product_type
const productTypeRoutes = require('./routes/product_type.routes');
app.use('/api/product_type', productTypeRoutes);

// Middleware de errores
const errorMiddleware = require('./middlewares/error.middleware');
app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
