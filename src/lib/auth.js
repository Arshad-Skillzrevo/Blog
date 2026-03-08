import jwt from "jsonwebtoken";

const SECRET = "skillzrevo-secret";

export function createToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: "1d" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}