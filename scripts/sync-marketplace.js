#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  SKILLS_DIR,
  PLUGINS_DIR,
  MARKETPLACE_FILE,
  CODEX_MARKETPLACE_FILE,
  PLUGIN_GROUPS_FILE,
  buildMarketplace,
  buildClaudePluginManifest,
  buildCodexPluginManifest,
  buildCodexMarketplace,
  claudeManifestPath,
  codexManifestPath,
  isGeneratedPluginPackage,
  parseFrontmatter,
  pluginRootPath,
  pluginSkillsPath,
  readPackageMeta,
  serialize
} from './lib/plugin-shape.js';
import { loadPluginGroups } from './lib/plugin-groups.js';

const README_FILE = 'README.md';
const PLUGINS_TABLE_START = '<!-- PLUGINS_TABLE_START -->';
const PLUGINS_TABLE_END = '<!-- PLUGINS_TABLE_END -->';

function log(message) {
  console.log(message);
}

function success(message) {
  console.log(`✅ ${message}`);
}

function fail(message) {
  console.log(`❌ ${message}`);
  process.exit(1);
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
 * Write marketplace.json from plugin-groups.json plus the released version.
 */
function updateMarketplace(pluginGroups, meta, owner) {
  let existingPluginNames = new Set();

  if (fs.existsSync(MARKETPLACE_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(MARKETPLACE_FILE, 'utf-8'));
      existingPluginNames = new Set(
        Array.isArray(existing.plugins) ? existing.plugins.map(p => p.name) : []
      );
    } catch (e) {
      log(`⚠️  Could not read existing marketplace.json: ${e.message}`);
    }
  }

  fs.writeFileSync(MARKETPLACE_FILE, serialize(buildMarketplace(pluginGroups, meta, owner)));

  const newPluginNames = new Set(pluginGroups.map(p => p.name));
  return {
    added: pluginGroups.filter(p => !existingPluginNames.has(p.name)).map(p => p.name),
    removed: [...existingPluginNames].filter(name => !newPluginNames.has(name))
  };
}

function copyPluginSkills(plugin) {
  const skillsDir = pluginSkillsPath(plugin.name);

  fs.rmSync(skillsDir, { recursive: true, force: true });
  fs.mkdirSync(skillsDir, { recursive: true });

  for (const skillName of plugin.skills) {
    fs.cpSync(path.join(SKILLS_DIR, skillName), path.join(skillsDir, skillName), {
      recursive: true,
      filter: source => path.basename(source) !== '.DS_Store'
    });
  }
}

function removeStalePluginPackages(pluginGroups) {
  if (!fs.existsSync(PLUGINS_DIR)) {
    return;
  }

  const expectedPluginNames = new Set(pluginGroups.map(plugin => plugin.name));

  for (const entry of fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || expectedPluginNames.has(entry.name)) {
      continue;
    }

    const pluginRoot = path.join(PLUGINS_DIR, entry.name);
    if (isGeneratedPluginPackage(pluginRoot)) {
      fs.rmSync(pluginRoot, { recursive: true, force: true });
    }
  }
}

function writeManifest(manifestPath, manifest) {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, serialize(manifest));
}

/**
 * Generate the plugin packages under plugins/<name>.
 *
 * One package serves both agents: Claude Code reads .claude-plugin/plugin.json
 * and Codex reads .codex-plugin/plugin.json, and both discover the same
 * bundled skills/ directory.
 */
function updatePluginPackages(pluginGroups, meta, owner) {
  fs.mkdirSync(PLUGINS_DIR, { recursive: true });
  removeStalePluginPackages(pluginGroups);

  for (const plugin of pluginGroups) {
    fs.mkdirSync(pluginRootPath(plugin.name), { recursive: true });
    writeManifest(
      claudeManifestPath(plugin.name),
      buildClaudePluginManifest(plugin, meta.version, owner)
    );
    writeManifest(
      codexManifestPath(plugin.name),
      buildCodexPluginManifest(plugin, meta.version, owner)
    );
    copyPluginSkills(plugin);
  }

  fs.mkdirSync(path.dirname(CODEX_MARKETPLACE_FILE), { recursive: true });
  fs.writeFileSync(CODEX_MARKETPLACE_FILE, serialize(buildCodexMarketplace(pluginGroups)));
}

/**
 * Build the README.md skills table
 */
function buildSkillsTable(skills) {
  const tableHeader = '| Skill | Description |\n|-------|-------------|';
  const tableRows = skills.map(skill =>
    `| [${skill.name}](./skills/${skill.folderName}) | ${skill.description} |`
  ).join('\n');

  return `<!-- SKILLS_TABLE_START -->\n${tableHeader}\n${tableRows}\n<!-- SKILLS_TABLE_END -->`;
}

function replaceSkillsTable(content, skills) {
  const newTable = buildSkillsTable(skills);

  if (content.includes('<!-- SKILLS_TABLE_START -->') && content.includes('<!-- SKILLS_TABLE_END -->')) {
    return content.replace(
      /<!-- SKILLS_TABLE_START -->[\s\S]*?<!-- SKILLS_TABLE_END -->/,
      newTable
    );
  }

  // Fallback: try to find an existing table under "## Available Skills"
  const tableRegex = /(## Available Skills\s*\n+)\|[^\n]+\|\n\|[-|]+\|\n(\|[^\n]+\|\n?)*/;
  if (tableRegex.test(content)) {
    return content.replace(tableRegex, `$1${newTable}\n`);
  }

  log('⚠️  Could not find skills table in README.md. Add markers manually.');
  return content;
}

/**
 * Build the README.md plugin groups table
 */
function replacePluginGroupsTable(content, pluginGroups) {
  const tableHeader = '| Plugin | Description | Skills |\n|--------|-------------|--------|';

  const tableRows = pluginGroups.map(plugin => {
    const skillsHtml = plugin.skills
      .map(skillName => `[${skillName}](./skills/${skillName})`)
      .join('<br>');

    return `| [${plugin.name}](./plugin-groups.json) | ${plugin.description} | ${skillsHtml} |`;
  }).join('\n');

  const newTable = `${PLUGINS_TABLE_START}\n${tableHeader}\n${tableRows}\n${PLUGINS_TABLE_END}`;

  if (content.includes(PLUGINS_TABLE_START) && content.includes(PLUGINS_TABLE_END)) {
    return content.replace(
      /<!-- PLUGINS_TABLE_START -->[\s\S]*?<!-- PLUGINS_TABLE_END -->/,
      newTable
    );
  }

  // Fallback: try to find an existing table under "## Plugin Groups"
  const tableRegex = /(## Plugin Groups\s*\n+[\s\S]*?\n)\|[^\n]+\|\n\|[-|]+\|\n(\|[^\n]+\|\n?)*/;
  if (tableRegex.test(content)) {
    return content.replace(tableRegex, `$1${newTable}\n`);
  }

  log('⚠️  Could not find plugin groups table in README.md. Add markers manually.');
  return content;
}

function updateReadme(skills, pluginGroups) {
  if (!fs.existsSync(README_FILE)) {
    log('⚠️  README.md not found, skipping update');
    return false;
  }

  const original = fs.readFileSync(README_FILE, 'utf-8');
  const updated = replacePluginGroupsTable(replaceSkillsTable(original, skills), pluginGroups);

  if (updated === original) {
    return false;
  }

  fs.writeFileSync(README_FILE, updated);
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

  let meta;
  try {
    meta = readPackageMeta();
  } catch (e) {
    fail(e.message);
  }

  const skills = getSkills();
  log(`Found ${skills.length} valid skill(s)`);
  log('');

  const config = loadPluginGroups(skills.map(skill => skill.folderName), fail);
  const pluginGroups = config.plugins;

  log('🧩 Updating marketplace.json...');
  const { added, removed } = updateMarketplace(pluginGroups, meta, config.owner);

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

  log('📝 Updating README.md...');
  if (updateReadme(skills, pluginGroups)) {
    success('README.md tables updated');
  } else {
    log('   No changes to README.md');
  }
  log('');

  log('🔌 Updating plugin packages...');
  updatePluginPackages(pluginGroups, meta, config.owner);
  success('Claude and Codex plugin packages updated');
  log('');

  log('=======================================');
  success(`Sync complete! (version ${meta.version})`);
  log('');

  log('Current skills:');
  for (const skill of skills) {
    log(`  • ${skill.name}`);
  }
  log('');
}

main();
