const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/user.model");
const { saveRefreshToken, findRefreshToken, deleteRefreshToken }
  = require("../models/token.model");

// Crear JWT Access Token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

// Crear Refresh Token
function generateRefreshToken(user) {
  const token = jwt.sign(
    { id: user.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return token;
}

// ---------------- REGISTER ----------------
async function register(req, res) {
  const { email, password } = req.body;

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: "El email ya está registrado" });
  }

  const hash = await bcrypt.hash(password, 10);

  const newUser = await createUser(email, hash);

  return res.json({ ok: true, user: newUser });
}

// ---------------- LOGIN ----------------
async function login(req, res) {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: "Contraseña incorrecta" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await saveRefreshToken(user.id, refreshToken, expiresAt);

  return res.json({
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, role: user.role }
  });
}

// ---------------- REFRESH TOKEN ----------------
async function refresh(req, res) {
  const { token } = req.body;

  const saved = await findRefreshToken(token);
  if (!saved) return res.status(403).json({ message: "Refresh token inválido" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const user = { id: decoded.id };

    const newAccessToken = jwt.sign(
      user,
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({ accessToken: newAccessToken });

  } catch (err) {
    return res.status(403).json({ message: "Refresh token expirado" });
  }
}

// ---------------- LOGOUT ----------------
async function logout(req, res) {
  const { token } = req.body;
  await deleteRefreshToken(token);
  return res.json({ ok: true });
}

module.exports = { register, login, refresh, logout };
