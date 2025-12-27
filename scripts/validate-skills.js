#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

const SKILLS_DIR = 'skills';
const MARKETPLACE_FILE = '.claude-plugin/marketplace.json';

let errors = [];
let warnings = [];

function log(message) {
  console.log(message);
}

function error(message) {
  errors.push(message);
  console.error(`❌ ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`⚠️  ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

/**
 * Parse YAML frontmatter from a markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }
  try {
    return parseYaml(match[1]);
  } catch (e) {
    return null;
  }
}

/**
 * Get all skill directories
 */
function getSkillDirs() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

/**
 * Validate a single skill
 */
function validateSkill(skillName) {
  const skillPath = path.join(SKILLS_DIR, skillName);
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  // Check SKILL.md exists
  if (!fs.existsSync(skillMdPath)) {
    error(`Skill "${skillName}": Missing SKILL.md file`);
    return null;
  }

  // Read and parse SKILL.md
  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    error(`Skill "${skillName}": SKILL.md has no valid YAML frontmatter`);
    return null;
  }

  // Validate required fields
  if (!frontmatter.name) {
    error(`Skill "${skillName}": Missing "name" in frontmatter`);
  }

  if (!frontmatter.description) {
    error(`Skill "${skillName}": Missing "description" in frontmatter`);
  }

  // Warn if name doesn't match folder name
  if (frontmatter.name && frontmatter.name !== skillName) {
    warn(`Skill "${skillName}": Frontmatter name "${frontmatter.name}" doesn't match folder name`);
  }

  return frontmatter;
}

/**
 * Validate marketplace.json
 */
function validateMarketplace(skillsInFolder) {
  // Check file exists
  if (!fs.existsSync(MARKETPLACE_FILE)) {
    error(`Missing ${MARKETPLACE_FILE}`);
    return null;
  }

  // Parse JSON
  let marketplace;
  try {
    const content = fs.readFileSync(MARKETPLACE_FILE, 'utf-8');
    marketplace = JSON.parse(content);
  } catch (e) {
    error(`${MARKETPLACE_FILE}: Invalid JSON - ${e.message}`);
    return null;
  }

  // Validate required fields
  if (!marketplace.name) {
    error(`${MARKETPLACE_FILE}: Missing "name" field`);
  }

  if (!marketplace.owner) {
    error(`${MARKETPLACE_FILE}: Missing "owner" field`);
  } else if (!marketplace.owner.name) {
    error(`${MARKETPLACE_FILE}: Missing "owner.name" field`);
  }

  if (!Array.isArray(marketplace.plugins)) {
    error(`${MARKETPLACE_FILE}: Missing or invalid "plugins" array`);
    return marketplace;
  }

  // Get skills listed in marketplace
  const skillsInMarketplace = new Set();
  for (const plugin of marketplace.plugins) {
    if (!plugin.name) {
      error(`${MARKETPLACE_FILE}: Plugin missing "name" field`);
      continue;
    }
    if (!plugin.source) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" missing "source" field`);
      continue;
    }

    // Extract skill name from source path
    const match = plugin.source.match(/\.\/skills\/(.+)/);
    if (match) {
      skillsInMarketplace.add(match[1]);
    }
  }

  // Check for skills in folder but not in marketplace
  for (const skill of skillsInFolder) {
    if (!skillsInMarketplace.has(skill)) {
      error(`Skill "${skill}" exists in folder but not in marketplace.json`);
    }
  }

  // Check for skills in marketplace but not in folder
  for (const skill of skillsInMarketplace) {
    if (!skillsInFolder.includes(skill)) {
      error(`Skill "${skill}" in marketplace.json but not found in skills folder`);
    }
  }

  return marketplace;
}

/**
 * Main validation
 */
function main() {
  log('');
  log('🔍 Validating AI Agent Skills Repository');
  log('=========================================');
  log('');

  // Get all skill directories
  const skillDirs = getSkillDirs();
  log(`Found ${skillDirs.length} skill(s) in ${SKILLS_DIR}/`);
  log('');

  // Validate each skill
  log('📁 Validating skills...');
  const validSkills = [];
  for (const skillName of skillDirs) {
    const metadata = validateSkill(skillName);
    if (metadata && metadata.name && metadata.description) {
      validSkills.push(skillName);
    }
  }
  log('');

  // Validate marketplace.json
  log('📦 Validating marketplace.json...');
  validateMarketplace(skillDirs);
  log('');

  // Summary
  log('=========================================');
  if (errors.length === 0) {
    success(`All validations passed! (${validSkills.length} valid skills)`);
    log('');
    process.exit(0);
  } else {
    log('');
    error(`Found ${errors.length} error(s)`);
    if (warnings.length > 0) {
      warn(`Found ${warnings.length} warning(s)`);
    }
    log('');
    process.exit(1);
  }
}

main();
