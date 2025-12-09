import {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/user.service.js";
import {
  authenticateJWT,
  checkadminRole,
  checkUserRole,
} from "../middlewares/authJWT.js";
import express from "express";

const userRouter = express.Router();
userRouter.get("/", authenticateJWT, checkadminRole, async (req, res) => {
  try {
    const users = await findAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get(
  "/:id",
  authenticateJWT,
  checkUserRole(["admin", "user"]),
  async (req, res) => {
    try {
      const user = await findUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
userRouter.post("/", async (req, res) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.put(
  "/:id",
  authenticateJWT,
  checkUserRole(["admin", "user"]),
  async (req, res) => {
    try {
      const updatedUser = await updateUser(req.params.id, req.body);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

userRouter.delete("/:id", authenticateJWT, checkadminRole, async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.put(
  "/:id",
  authenticateJWT,
  checkUserRole(["admin", "user"]),
  async (req, res) => {}
);

export default userRouter;