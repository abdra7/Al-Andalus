#!/usr/bin/env node
// Deploy script: builds the app and copies dist/ into the الأندلس/ subdirectory
// of a clone of the abdra7.github.io repository, then commits and pushes.
//
// Usage:
//   node scripts/deploy.mjs            # build + deploy
//   DRY_RUN=1 node scripts/deploy.mjs  # build only, no push
//
// Prerequisites:
//   - git push access to abdra7/abdra7.github.io (gh auth token or credential helper)
//   - The GitHub Pages build then serves the new files automatically.

import { execFileSync } from "node:child_process";
import { existsSync, rmSync, cpSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DEPLOY_REPO = process.env.PAGES_REPO_URL ?? "https://github.com/abdra7/abdra7.github.io.git";
const WORK_DIR = process.env.DEPLOY_WORK_DIR ?? "/tmp/al-andalus-pages-deploy";
const ARABIC_DIR = "الأندلس";
const DRY_RUN = process.env.DRY_RUN === "1";

function run(cmd, args, opts = {}) {
  console.log(`→ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { stdio: "inherit", cwd: opts.cwd ?? ROOT, ...opts });
}

// 1. Build
console.log("Building production bundle…");
run("npx", ["vite", "build"]);

if (DRY_RUN) {
  console.log("DRY_RUN=1 — skipping clone/copy/push.");
  process.exit(0);
}

// 2. Clone (or update) the Pages repository
if (existsSync(WORK_DIR)) {
  console.log("Updating existing Pages clone…");
  run("git", ["-C", WORK_DIR, "pull", "--ff-only"]);
} else {
  console.log("Cloning Pages repository…");
  rmSync(WORK_DIR, { recursive: true, force: true });
  mkdirSync(WORK_DIR, { recursive: true });
  run("git", ["clone", "--depth", "1", DEPLOY_REPO, WORK_DIR]);
}

// 3. Replace the الأندلس/ subdirectory contents
const target = resolve(WORK_DIR, ARABIC_DIR);
console.log(`Syncing dist/ → ${ARABIC_DIR}/`);
rmSync(target, { recursive: true, force: true });
cpSync(resolve(ROOT, "dist"), target, { recursive: true });

// 4. Commit and push
const status = execFileSync("git", ["-C", WORK_DIR, "status", "--porcelain", ARABIC_DIR], { encoding: "utf8" });
if (!status.trim()) {
  console.log("No changes to deploy.");
  process.exit(0);
}

run("git", ["-C", WORK_DIR, "add", ARABIC_DIR]);
run("git", ["-C", WORK_DIR, "commit", "-m", "chore(الأندلس): deploy Al-Andalus atlas update"]);
run("git", ["-C", WORK_DIR, "push"]);

console.log("\nDeployed. GitHub Pages will publish https://abdulrahim.page/الأندلس shortly.");
console.log("Verify with: curl -sI 'https://abdulrahim.page/%D8%A7%D9%84%D8%A3%D9%86%D8%AF%D9%84%D8%B3/'");
