import {Router} from 'express';
import {getProductById, getProducts, createProduct, deleteProduct, updateProduct} from '../controller/product.controller.js'; 


const productRouter = Router();


productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', createProduct);
productRouter.put('/:id', updateProduct); 
productRouter.delete('/:id', deleteProduct);

export default productRouter;
