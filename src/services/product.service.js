import { db } from "../firebase/config.js";
import { ProductModel } from "../models/product.model.js";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

const collectionName = "productos"

export const getAllProducts = async () => {
  const productsCol = await collection(db, collectionName);
  const productsSnapshot = await getDocs(productsCol);
  if (productsSnapshot.empty) return [];
  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id) => {
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return null;
  }
  return { id: productSnap.id, ...productSnap.data() };
};

export const createProduct = async (product) => {
  if (!product || !(product instanceof ProductModel)) {
    throw new Error("Invalid product data");
  }
  const productsCol = collection(db, "products");
  const newProductRef = await addDoc(productsCol, product);
  return newProductRef.id;
};

export const updateProduct = async (id, updatedProduct) => {
  if (!updatedProduct || !(updatedProduct instanceof ProductModel)) {
    throw new Error("Invalid product data");
  }

  const productRef = doc(db, "products", id);
  const productSnap = await updateDoc(productRef, updatedProduct);
  return id, productSnap.data();
};

export const deleteProduct = async (id) => {
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (!productSnap.exists()) {
    return false;
  }
  await deleteDoc(productRef);
  return true;
};
