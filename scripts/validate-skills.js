#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

const SKILLS_DIR = 'skills';
const MARKETPLACE_FILE = '.claude-plugin/marketplace.json';
const CODEX_MARKETPLACE_FILE = '.agents/plugins/marketplace.json';
const CODEX_PLUGINS_DIR = 'plugins';
const PLUGIN_GROUPS_FILE = 'plugin-groups.json';
const PLUGIN_SUFFIX = '-skills';
const PLUGIN_SOURCE = './';

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

function hasPluginSuffix(value) {
  return value.endsWith(PLUGIN_SUFFIX);
}

function buildExpectedMarketplacePlugins(pluginGroups) {
  return pluginGroups.map(plugin => ({
    name: plugin.name,
    description: plugin.description,
    source: PLUGIN_SOURCE,
    strict: false,
    skills: plugin.skills.map(skillName => `./skills/${skillName}`)
  }));
}

function buildExpectedCodexMarketplacePlugins(pluginGroups) {
  return pluginGroups.map(plugin => ({
    name: plugin.name,
    source: {
      source: 'local',
      path: `./plugins/${plugin.name}`
    },
    policy: {
      installation: 'AVAILABLE',
      authentication: 'ON_INSTALL'
    },
    category: 'Productivity'
  }));
}

/**
 * Parse YAML frontmatter from a markdown file
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
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

  if (Object.prototype.hasOwnProperty.call(frontmatter, 'author')) {
    error(`Skill "${skillName}": Remove "author" from frontmatter; this repository no longer tracks skill authors`);
  }

  // Warn if name doesn't match folder name
  if (frontmatter.name && frontmatter.name !== skillName) {
    warn(`Skill "${skillName}": Frontmatter name "${frontmatter.name}" doesn't match folder name`);
  }

  return frontmatter;
}

/**
 * Validate plugin-groups.json
 */
function validatePluginGroups(skillsInFolder) {
  if (!fs.existsSync(PLUGIN_GROUPS_FILE)) {
    error(`Missing ${PLUGIN_GROUPS_FILE}`);
    return null;
  }

  let config;
  try {
    const content = fs.readFileSync(PLUGIN_GROUPS_FILE, 'utf-8');
    config = JSON.parse(content);
  } catch (e) {
    error(`${PLUGIN_GROUPS_FILE}: Invalid JSON - ${e.message}`);
    return null;
  }

  if (!config || !Array.isArray(config.plugins)) {
    error(`${PLUGIN_GROUPS_FILE}: Missing or invalid "plugins" array`);
    return null;
  }

  const assignedSkills = new Set();
  const pluginNames = new Set();

  for (const plugin of config.plugins) {
    if (!plugin.name) {
      error(`${PLUGIN_GROUPS_FILE}: Plugin missing "name"`);
      continue;
    }
    if (pluginNames.has(plugin.name)) {
      error(`${PLUGIN_GROUPS_FILE}: Duplicate plugin "${plugin.name}"`);
    }
    pluginNames.add(plugin.name);

    if (!hasPluginSuffix(plugin.name)) {
      error(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" must end with "${PLUGIN_SUFFIX}"`);
    }
    if (!plugin.description) {
      error(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "description"`);
    }
    if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
      error(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "skills" array`);
      continue;
    }

    for (const skillName of plugin.skills) {
      if (!skillsInFolder.includes(skillName)) {
        error(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" references unknown skill "${skillName}"`);
        continue;
      }
      if (assignedSkills.has(skillName)) {
        error(`${PLUGIN_GROUPS_FILE}: Skill "${skillName}" listed in multiple plugins`);
        continue;
      }
      assignedSkills.add(skillName);
    }
  }

  for (const skillName of skillsInFolder) {
    if (!assignedSkills.has(skillName)) {
      error(`${PLUGIN_GROUPS_FILE}: Skill "${skillName}" not assigned to any plugin`);
    }
  }

  return config.plugins;
}

/**
 * Validate marketplace.json
 */
function validateMarketplace(skillsInFolder, pluginGroups) {
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

  const pluginNames = new Set();
  // Get skills listed in marketplace from the skills arrays
  const skillsInMarketplace = new Set();
  for (const plugin of marketplace.plugins) {
    if (!plugin.name) {
      error(`${MARKETPLACE_FILE}: Plugin missing "name" field`);
      continue;
    }
    if (pluginNames.has(plugin.name)) {
      error(`${MARKETPLACE_FILE}: Duplicate plugin "${plugin.name}"`);
    }
    pluginNames.add(plugin.name);
    if (!hasPluginSuffix(plugin.name)) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" must end with "${PLUGIN_SUFFIX}"`);
    }
    if (!plugin.description) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" missing "description" field`);
    }
    if (!plugin.source) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" missing "source" field`);
      continue;
    }

    // Validate source is "./"
    if (plugin.source !== PLUGIN_SOURCE) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" has invalid source "${plugin.source}" (expected "${PLUGIN_SOURCE}")`);
    } else {
      const sourcePath = path.resolve(process.cwd(), plugin.source);
      if (!fs.existsSync(sourcePath)) {
        warn(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" source path "${plugin.source}" does not exist`);
      }
    }

    // Validate skills array exists
    if (!Array.isArray(plugin.skills)) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" missing "skills" array`);
      continue;
    }
    if (plugin.strict !== false) {
      error(`${MARKETPLACE_FILE}: Plugin "${plugin.name}" must set "strict" to false`);
    }

    // Extract skill names from skills array
    for (const skillPath of plugin.skills) {
      const match = skillPath.match(/\.\/skills\/(.+)/);
      if (match) {
        if (skillsInMarketplace.has(match[1])) {
          error(`${MARKETPLACE_FILE}: Skill "${match[1]}" listed in multiple plugins`);
        }
        skillsInMarketplace.add(match[1]);
      } else {
        warn(`${MARKETPLACE_FILE}: Invalid skill path "${skillPath}" in plugin "${plugin.name}"`);
      }
    }
  }

  // Check for skills in folder but not in marketplace
  for (const skill of skillsInFolder) {
    if (!skillsInMarketplace.has(skill)) {
      error(`Skill "${skill}" exists in folder but not in any plugin's skills array`);
    }
  }

  // Check for skills in marketplace but not in folder
  for (const skill of skillsInMarketplace) {
    if (!skillsInFolder.includes(skill)) {
      error(`Skill "${skill}" in marketplace.json but not found in skills folder`);
    }
  }

  if (pluginGroups) {
    const expectedPlugins = buildExpectedMarketplacePlugins(pluginGroups);
    const actualByName = new Map(marketplace.plugins.map(plugin => [plugin.name, plugin]));
    const expectedByName = new Map(expectedPlugins.map(plugin => [plugin.name, plugin]));

    for (const expectedPlugin of expectedPlugins) {
      const actualPlugin = actualByName.get(expectedPlugin.name);
      if (!actualPlugin) {
        error(`${MARKETPLACE_FILE}: Missing plugin "${expectedPlugin.name}" from ${PLUGIN_GROUPS_FILE}`);
        continue;
      }

      if (actualPlugin.description !== expectedPlugin.description) {
        error(`${MARKETPLACE_FILE}: Plugin "${expectedPlugin.name}" description is out of sync with ${PLUGIN_GROUPS_FILE}`);
      }
      if (actualPlugin.source !== expectedPlugin.source) {
        error(`${MARKETPLACE_FILE}: Plugin "${expectedPlugin.name}" source is out of sync with ${PLUGIN_GROUPS_FILE}`);
      }
      if (actualPlugin.strict !== expectedPlugin.strict) {
        error(`${MARKETPLACE_FILE}: Plugin "${expectedPlugin.name}" strict flag is out of sync with ${PLUGIN_GROUPS_FILE}`);
      }
      if (JSON.stringify(actualPlugin.skills) !== JSON.stringify(expectedPlugin.skills)) {
        error(`${MARKETPLACE_FILE}: Plugin "${expectedPlugin.name}" skills are out of sync with ${PLUGIN_GROUPS_FILE}`);
      }
    }

    for (const pluginName of actualByName.keys()) {
      if (!expectedByName.has(pluginName)) {
        error(`${MARKETPLACE_FILE}: Unexpected plugin "${pluginName}" not defined in ${PLUGIN_GROUPS_FILE}`);
      }
    }
  }

  return marketplace;
}

/**
 * Validate Codex marketplace and plugin packages.
 */
function validateCodexMarketplace(pluginGroups) {
  if (!fs.existsSync(CODEX_MARKETPLACE_FILE)) {
    error(`Missing ${CODEX_MARKETPLACE_FILE}`);
    return null;
  }

  let marketplace;
  try {
    const content = fs.readFileSync(CODEX_MARKETPLACE_FILE, 'utf-8');
    marketplace = JSON.parse(content);
  } catch (e) {
    error(`${CODEX_MARKETPLACE_FILE}: Invalid JSON - ${e.message}`);
    return null;
  }

  if (marketplace.name !== 'awesome-ai-agent-skills') {
    error(`${CODEX_MARKETPLACE_FILE}: Expected marketplace name "awesome-ai-agent-skills"`);
  }

  if (!marketplace.interface || marketplace.interface.displayName !== 'Awesome AI Agent Skills') {
    error(`${CODEX_MARKETPLACE_FILE}: Missing interface.displayName "Awesome AI Agent Skills"`);
  }

  if (!Array.isArray(marketplace.plugins)) {
    error(`${CODEX_MARKETPLACE_FILE}: Missing or invalid "plugins" array`);
    return marketplace;
  }

  if (pluginGroups) {
    const expectedPlugins = buildExpectedCodexMarketplacePlugins(pluginGroups);
    if (JSON.stringify(marketplace.plugins) !== JSON.stringify(expectedPlugins)) {
      error(`${CODEX_MARKETPLACE_FILE}: plugins array is out of sync with ${PLUGIN_GROUPS_FILE}`);
    }
  }

  for (const plugin of marketplace.plugins) {
    if (!plugin.name) {
      error(`${CODEX_MARKETPLACE_FILE}: Plugin missing "name"`);
      continue;
    }

    const source = plugin.source;
    if (!source || source.source !== 'local' || source.path !== `./plugins/${plugin.name}`) {
      error(`${CODEX_MARKETPLACE_FILE}: Plugin "${plugin.name}" must use local source path "./plugins/${plugin.name}"`);
    }

    if (!plugin.policy || plugin.policy.installation !== 'AVAILABLE' || plugin.policy.authentication !== 'ON_INSTALL') {
      error(`${CODEX_MARKETPLACE_FILE}: Plugin "${plugin.name}" must include policy.installation AVAILABLE and policy.authentication ON_INSTALL`);
    }

    if (!plugin.category) {
      error(`${CODEX_MARKETPLACE_FILE}: Plugin "${plugin.name}" missing "category"`);
    }
  }

  return marketplace;
}

function validatePackagedSkill(pluginName, skillName) {
  const skillPath = path.join(CODEX_PLUGINS_DIR, pluginName, 'skills', skillName);
  const skillMdPath = path.join(skillPath, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    error(`Codex plugin "${pluginName}": Missing bundled skill "${skillName}/SKILL.md"`);
    return;
  }

  const content = fs.readFileSync(skillMdPath, 'utf-8');
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter || !frontmatter.name || !frontmatter.description) {
    error(`Codex plugin "${pluginName}": Bundled skill "${skillName}" has invalid frontmatter`);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(frontmatter, 'author')) {
    error(`Codex plugin "${pluginName}": Bundled skill "${skillName}" must not contain "author" frontmatter`);
  }
}

function validateCodexPluginPackages(pluginGroups) {
  if (!pluginGroups) {
    return;
  }

  if (!fs.existsSync(CODEX_PLUGINS_DIR)) {
    error(`Missing ${CODEX_PLUGINS_DIR}/ directory for Codex plugin packages`);
    return;
  }

  const expectedPluginNames = new Set(pluginGroups.map(plugin => plugin.name));
  const entries = fs.readdirSync(CODEX_PLUGINS_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const manifestPath = path.join(CODEX_PLUGINS_DIR, entry.name, '.codex-plugin', 'plugin.json');
    if (fs.existsSync(manifestPath) && !expectedPluginNames.has(entry.name)) {
      error(`${CODEX_PLUGINS_DIR}/${entry.name}: Stale Codex plugin package not defined in ${PLUGIN_GROUPS_FILE}`);
    }
  }

  for (const plugin of pluginGroups) {
    const pluginRoot = path.join(CODEX_PLUGINS_DIR, plugin.name);
    const manifestPath = path.join(pluginRoot, '.codex-plugin', 'plugin.json');

    if (!fs.existsSync(manifestPath)) {
      error(`Codex plugin "${plugin.name}": Missing .codex-plugin/plugin.json`);
      continue;
    }

    let manifest;
    try {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch (e) {
      error(`${manifestPath}: Invalid JSON - ${e.message}`);
      continue;
    }

    if (JSON.stringify(manifest).includes('[TODO')) {
      error(`${manifestPath}: Contains unresolved [TODO] placeholder`);
    }
    if (manifest.name !== plugin.name) {
      error(`${manifestPath}: name is out of sync with ${PLUGIN_GROUPS_FILE}`);
    }
    if (!manifest.version) {
      error(`${manifestPath}: Missing version`);
    }
    if (manifest.description !== plugin.description) {
      error(`${manifestPath}: description is out of sync with ${PLUGIN_GROUPS_FILE}`);
    }
    if (manifest.skills !== './skills/') {
      error(`${manifestPath}: Expected skills path "./skills/"`);
    }
    if (!manifest.interface || !manifest.interface.displayName || !manifest.interface.developerName) {
      error(`${manifestPath}: Missing interface display metadata`);
    }

    const packagedSkillsDir = path.join(pluginRoot, 'skills');
    if (!fs.existsSync(packagedSkillsDir)) {
      error(`Codex plugin "${plugin.name}": Missing skills/ directory`);
      continue;
    }

    const actualSkills = fs.readdirSync(packagedSkillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    const expectedSkills = [...plugin.skills].sort();
    if (JSON.stringify(actualSkills) !== JSON.stringify(expectedSkills)) {
      error(`Codex plugin "${plugin.name}": bundled skills are out of sync with ${PLUGIN_GROUPS_FILE}`);
    }

    for (const skillName of plugin.skills) {
      validatePackagedSkill(plugin.name, skillName);
    }
  }
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

  log('🧩 Validating plugin-groups.json...');
  const pluginGroups = validatePluginGroups(skillDirs);
  log('');

  // Validate marketplace.json
  log('📦 Validating marketplace.json...');
  validateMarketplace(skillDirs, pluginGroups);
  log('');

  log('🔌 Validating Codex marketplace and plugins...');
  validateCodexMarketplace(pluginGroups);
  validateCodexPluginPackages(pluginGroups);
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
