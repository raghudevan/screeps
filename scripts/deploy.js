const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
console.log("Loaded env:", process.env);
const fs = require("fs");

const screepsPath = process.env.SCREEPS_SCRIPTS_PATH;
const distPath = path.join(__dirname, "../dist");

if (!screepsPath) {
  console.error("SCREEPS_SCRIPTS_PATH not found in .env file");
  process.exit(1);
}

console.log(`Deploying to: ${screepsPath}`);

// Clean the destination directory
try {
  const files = fs.readdirSync(screepsPath);
  for (const file of files) {
    const filePath = path.join(screepsPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
  }
  console.log("Cleaned destination directory");
} catch (error) {
  console.log("Destination directory was already empty or does not exist");
}

// Copy files from dist to Screeps scripts directory
try {
  const distFiles = fs.readdirSync(distPath);
  for (const file of distFiles) {
    const sourcePath = path.join(distPath, file);
    const destPath = path.join(screepsPath, file);

    const stat = fs.statSync(sourcePath);
    if (stat.isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file}`);
    }
  }
  console.log("Deploy completed successfully!");
} catch (error) {
  console.error("Error during deploy:", error);
  process.exit(1);
}
