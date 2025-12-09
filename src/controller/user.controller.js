import {findAllUsers, findUserById, createUser, verifyCredencials, updateUser} from "../services/user.service.js";
import jwt from "jsonwebtoken"

export const getAllUsers = (req,res) => {
    try{
        const users = findAllUsers();
        res.status(200).json(users)
    } catch(err) {
        res.status(500).json({message: err.message}) 
    }
}

export const getUserById = (req,res) => {
    try{
        const user = findUserById(req.params.id);
        if (!user) return res.status(404).json({message:"Usuario no encontrado"})
        res.status(200).json(user)
    } catch(err){
        res.status(500).json({message: err.message})
    }
}

export const createUserController = async (req,res) => {
    try{
        const newUser = await createUser(req.body);
        res.status(201).json(newUser)
    }catch (err) {
        res.status(400).json({message: err.message})
    }
}

export const updateUserController = async (req,res) => {
    try{
        const updated = await updateUser(req.params.id, req.body)
        if(!updated) return res.status(404).json({msj: "usuario no encontrado"})
        res.status(200).json(updated)
    } catch(err) {
        res.status(400).json({msj: err.message})
    }
}

export const deleteUserController = async (req,res) => {
    try{
        await deleteUser(req.params.id);  
        res.status(200).json({msj: "usuario eliminado"})
    } catch(err) {
        res.status(400).json({msj: err.message})
    }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Lógica de autenticación aquí
    const user = await verifyCredencials(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
