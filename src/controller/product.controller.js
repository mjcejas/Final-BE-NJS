import * as productService from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ msj: "Error al obtener productos", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductFromDBById(id);

    if (product.length === 0) {
      return res
        .status(404)
        .json({ msj: `Producto con ID ${id} no encontrado` });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ msj: "Error al obtener productos", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = { id: Date.now(), name, price, description };
    await productService.createProduct(newProduct);
    res.status(201).json({
      msj: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msj: "Error al crear producto", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);

    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ msj: `Producto con ID ${id} no encontrado` });
    }
    res
      .status(200)
      .json({ msj: `Producto con ID ${id} eliminado exitosamente` });
  } catch (error) {
    res
      .status(500)
      .json({ msj: "Error al eliminar producto", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const updatedProduct = { id, name, price, description };
    
    const updated = await productService.updateProduct(id, updatedProduct);

    res.status(200).json({
      msj: `Producto con ID ${id} actualizado exitosamente`,
      product: updated,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msj: "Error al actualizar producto", error: error.message });
  }
};
