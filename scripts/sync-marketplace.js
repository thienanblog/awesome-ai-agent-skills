#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

const SKILLS_DIR = 'skills';
const MARKETPLACE_FILE = '.claude-plugin/marketplace.json';
const README_FILE = 'README.md';

function log(message) {
  console.log(message);
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
 * Get all skills with their metadata
 */
function getSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  const skills = [];
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const skillName of dirs) {
    const skillMdPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) {
      log(`⚠️  Skipping "${skillName}": No SKILL.md found`);
      continue;
    }

    const content = fs.readFileSync(skillMdPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter || !frontmatter.name || !frontmatter.description) {
      log(`⚠️  Skipping "${skillName}": Invalid or incomplete frontmatter`);
      continue;
    }

    skills.push({
      folderName: skillName,
      name: frontmatter.name,
      description: frontmatter.description
    });
  }

  return skills;
}

/**
 * Update marketplace.json with skills
 * Each skill becomes its own plugin so users can install them individually
 */
function updateMarketplace(skills) {
  let marketplace = {
    name: 'awesome-ai-agent-skills',
    owner: {
      name: 'Community',
      email: ''
    },
    metadata: {
      description: 'Community-shared AI agent skills for Claude Code',
      version: '1.0.0'
    },
    plugins: []
  };

  // Read existing marketplace to preserve owner and metadata
  if (fs.existsSync(MARKETPLACE_FILE)) {
    try {
      const content = fs.readFileSync(MARKETPLACE_FILE, 'utf-8');
      const existing = JSON.parse(content);
      marketplace.name = existing.name || marketplace.name;
      marketplace.owner = existing.owner || marketplace.owner;
      marketplace.metadata = existing.metadata || marketplace.metadata;
    } catch (e) {
      log(`⚠️  Could not read existing marketplace.json: ${e.message}`);
    }
  }

  // Get existing plugin names for comparison
  const existingPluginNames = new Set(
    marketplace.plugins?.map(p => p.name) || []
  );

  // Build one plugin per skill (so users can install individually)
  marketplace.plugins = skills.map(skill => ({
    name: skill.name,
    description: skill.description,
    source: './',
    strict: false,
    skills: [`./skills/${skill.folderName}`]
  }));

  // Determine changes
  const newPluginNames = new Set(skills.map(s => s.name));
  const added = skills.filter(s => !existingPluginNames.has(s.name)).map(s => s.name);
  const removed = [...existingPluginNames].filter(name => !newPluginNames.has(name));

  // Write marketplace.json
  fs.writeFileSync(
    MARKETPLACE_FILE,
    JSON.stringify(marketplace, null, 2) + '\n'
  );

  return { added, removed };
}

/**
 * Update README.md skills table
 */
function updateReadme(skills) {
  if (!fs.existsSync(README_FILE)) {
    log(`⚠️  README.md not found, skipping update`);
    return false;
  }

  let content = fs.readFileSync(README_FILE, 'utf-8');

  // Build skills table
  const tableHeader = '| Skill | Description |\n|-------|-------------|';
  const tableRows = skills.map(skill =>
    `| [${skill.name}](./skills/${skill.folderName}) | ${skill.description} |`
  ).join('\n');
  const newTable = `<!-- SKILLS_TABLE_START -->\n${tableHeader}\n${tableRows}\n<!-- SKILLS_TABLE_END -->`;

  // Check if markers exist
  if (content.includes('<!-- SKILLS_TABLE_START -->') && content.includes('<!-- SKILLS_TABLE_END -->')) {
    // Replace between markers
    content = content.replace(
      /<!-- SKILLS_TABLE_START -->[\s\S]*?<!-- SKILLS_TABLE_END -->/,
      newTable
    );
  } else {
    // Try to find existing table under "## Available Skills"
    const tableRegex = /(## Available Skills\s*\n+)\|[^\n]+\|\n\|[-|]+\|\n(\|[^\n]+\|\n?)*/;
    if (tableRegex.test(content)) {
      content = content.replace(tableRegex, `$1${newTable}\n`);
    } else {
      log(`⚠️  Could not find skills table in README.md. Add markers manually.`);
      return false;
    }
  }

  fs.writeFileSync(README_FILE, content);
  return true;
}

/**
 * Main sync function
 */
function main() {
  log('');
  log('🔄 Syncing AI Agent Skills Marketplace');
  log('=======================================');
  log('');

  // Get all skills
  const skills = getSkills();
  log(`Found ${skills.length} valid skill(s)`);
  log('');

  // Update marketplace.json
  log('📦 Updating marketplace.json...');
  const { added, removed } = updateMarketplace(skills);

  if (added.length > 0) {
    success(`Added: ${added.join(', ')}`);
  }
  if (removed.length > 0) {
    log(`🗑️  Removed: ${removed.join(', ')}`);
  }
  if (added.length === 0 && removed.length === 0) {
    log('   No changes to marketplace.json');
  }
  log('');

  // Update README.md
  log('📝 Updating README.md...');
  const readmeUpdated = updateReadme(skills);
  if (readmeUpdated) {
    success('README.md skills table updated');
  }
  log('');

  // Summary
  log('=======================================');
  success('Sync complete!');
  log('');

  // List current skills
  log('Current skills:');
  for (const skill of skills) {
    log(`  • ${skill.name}`);
  }
  log('');
}

main();
