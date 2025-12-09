import express from 'express';
import userRouter from './routes/user.routes.js';
import 'dotenv/config';
import productRouter from './routes/product.routes.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(cors());
app.use('/users', userRouter); 
app.use('/products', productRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});