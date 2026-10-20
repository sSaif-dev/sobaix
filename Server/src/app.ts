import express from 'express'
import authRoutes from './modules/Auth/Auth.routes'
import ProductRoutes from './modules/Products/product.routes'
import CategoryRoutes from './modules/Category/Category.routes'

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/product', ProductRoutes);
app.use('/category',CategoryRoutes );






export default app;