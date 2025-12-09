import bcrypt from "bcryptjs";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config.js";
import { UserModel } from "../models/user.model.js";

const ruta = "usuarios";

export const findAllUsers = async () => {
  const snapshot = await getDocs(collection(db, ruta));
  return snapshot.docs.map((doc) => {
    const { password, ...userData } = doc.data();
    return new UserModel({ id: doc.id, ...userData });
  });
};

export const findUserById = async (id) => {
  const docRef = await getDoc(collection(db, ruta), id);
  if (!docRef.exists()) return null;
  const { password, ...userData } = docRef.data();
  return new UserModel({ id: docRef.id, ...userData });
};

export const createUser = async (userData) => {
  if (!userData.password) {
    throw new Error("Password is required");
  }
  if (!userData.email) {
    throw new Error("Email is required");
  }

  const qry = query(collection(db, ruta), where("email", "==", userData.email));

  const querySnapshot = await getDocs(qry);
  if (!querySnapshot.empty) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "user",
    location: userData.location || "unknown",
    skills: userData.skills || [],
  };
  const docRef = await addDoc(collection(db, ruta), newUser);
  return new UserModel({ id: docRef.id, ...userData });
};

export const updateUser = async (id, userData) => {
  const docRef = collection(db, ruta);
  await updateDoc(docRef, id, userData);
  return findUserById(id);
};

export const deleteUser = async (id) => {
  const docRef = collection(db, ruta);
  await deleteDoc(docRef, id);
  return true;
};

export const verifyCredencials = async (email, password) => {
  const qry = query(collection(db, ruta), where("email", "==", email));
  const snapshot = await getDocs(qry);
  if (snapshot.empty) {
    throw new Error("User not found");
  }
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const user = users.find((u) => u.email === email);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
  return new UserModel(user);
};
