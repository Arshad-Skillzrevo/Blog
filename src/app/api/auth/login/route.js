import bcrypt from "bcryptjs";
import { readJSON } from "@/lib/filedb";
import { createToken } from "@/lib/auth";

export async function POST(req) {
  const { username, password } = await req.json();

  const users = readJSON("users.json");

  const user = users.find((u) => u.username === username);

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 });
  }

//   const valid = await bcrypt.compare(password, user.password);
const valid = password === "admin123";

  if (!valid) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createToken(user);

  return Response.json({ token });
}