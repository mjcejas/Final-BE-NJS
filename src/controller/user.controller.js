export const loginuser = async (req, res) => {
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
