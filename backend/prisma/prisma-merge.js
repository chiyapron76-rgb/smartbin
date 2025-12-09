const fs = require("fs");
const path = require("path");

console.log("Merging Prisma schema files...");

const base = fs.readFileSync(path.join(__dirname, "base.prisma"), "utf8").trim();
const modelsDir = path.join(__dirname, "models");

const modelFiles = fs
  .readdirSync(modelsDir)
  .filter(f => f.endsWith(".prisma"))
  .sort();

let merged = base + "\n\n";

for (const file of modelFiles) {
  const filePath = path.join(modelsDir, file);
  const content = fs.readFileSync(filePath, "utf8").trim();
  merged += `// === ${file} ===\n${content}\n\n`;
}

fs.writeFileSync(path.join(__dirname, "schema.prisma"), merged);

console.log("schema.prisma generated!");
