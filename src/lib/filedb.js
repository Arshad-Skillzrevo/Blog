import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src/data");

export function readJSON(file) {
  const filePath = path.join(dataDir, file);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export function writeJSON(file, data) {
  const filePath = path.join(dataDir, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}