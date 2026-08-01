#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {
  SKILLS_DIR,
  PLUGINS_DIR,
  MARKETPLACE_FILE,
  CODEX_MARKETPLACE_FILE,
  buildMarketplace,
  buildClaudePluginManifest,
  buildCodexPluginManifest,
  buildCodexMarketplace,
  claudeManifestPath,
  codexManifestPath,
  diffKeys,
  isGeneratedPluginPackage,
  parseFrontmatter,
  pluginSkillsPath,
  readPackageMeta,
  serialize
} from './lib/plugin-shape.js';
import { loadPluginGroups } from './lib/plugin-groups.js';

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
  const skillMdPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

  if (!fs.existsSync(skillMdPath)) {
    error(`Skill "${skillName}": Missing SKILL.md file`);
    return null;
  }

  const skillContent = fs.readFileSync(skillMdPath, 'utf-8');
  const frontmatter = parseFrontmatter(skillContent);

  if (!frontmatter) {
    error(`Skill "${skillName}": SKILL.md has no valid YAML frontmatter`);
    return null;
  }

  if (!frontmatter.name) {
    error(`Skill "${skillName}": Missing "name" in frontmatter`);
  }

  if (!frontmatter.description) {
    error(`Skill "${skillName}": Missing "description" in frontmatter`);
  }

  if (Object.prototype.hasOwnProperty.call(frontmatter, 'author')) {
    error(`Skill "${skillName}": Remove "author" from frontmatter; this repository no longer tracks skill authors`);
  }

  if (String(frontmatter.context || '').toLowerCase() === 'fork' || frontmatter.agent) {
    error(`Skill "${skillName}": Remove subagent execution frontmatter ("context: fork"/"agent"); skills must run in the main conversation unless the user explicitly approves subagents at runtime`);
  }

  const hasSubagentConsentGate = [
    /main\s+conversation/i,
    /increase\s+usage|usage\s+impact/i,
    /proposed\s+(?:agent\s+)?count\s+and\s+scope/i,
    /ask\s+again\s+before\s+expanding|expanding\s+(?:an\s+|the\s+)?approved\s+scope\s+requires\s+fresh\s+approval/i
  ].every(pattern => pattern.test(skillContent));

  if (!hasSubagentConsentGate) {
    error(`Skill "${skillName}": Add a subagent consent gate that keeps work in the main conversation by default, warns that delegation can increase usage, requires approval for the proposed count and scope, and requires fresh approval before expansion`);
  }

  if (frontmatter.name && frontmatter.name !== skillName) {
    warn(`Skill "${skillName}": Frontmatter name "${frontmatter.name}" doesn't match folder name`);
  }

  return frontmatter;
}

/**
 * Compare a committed generated file against what `npm run sync` would write.
 *
 * Diffing the whole shape, rather than spot-checking fields, is what keeps a
 * hand-edit or a stray newer-only schema key from reaching users: Claude Code
 * rejects unrecognized manifest keys outright, so any extra key breaks the
 * marketplace for anyone on an older client.
 */
function expectGenerated(filePath, expected) {
  if (!fs.existsSync(filePath)) {
    error(`Missing ${filePath} - run "npm run sync"`);
    return;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');

  let actual;
  try {
    actual = JSON.parse(raw);
  } catch (e) {
    error(`${filePath}: Invalid JSON - ${e.message}`);
    return;
  }

  if (raw.includes('[TODO')) {
    error(`${filePath}: Contains unresolved [TODO] placeholder`);
  }

  const changed = diffKeys(actual, expected);
  if (changed.length > 0) {
    error(`${filePath}: out of sync (${changed.join(', ')}) - run "npm run sync"`);
    return;
  }

  // diffKeys compares key by key; this catches formatting drift too.
  if (raw !== serialize(expected)) {
    error(`${filePath}: formatting differs from generated output - run "npm run sync"`);
  }
}

function validateBundledSkill(pluginName, skillName) {
  const bundledPath = path.join(pluginSkillsPath(pluginName), skillName, 'SKILL.md');
  const canonicalPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');

  if (!fs.existsSync(bundledPath)) {
    error(`Plugin "${pluginName}": Missing bundled skill "${skillName}/SKILL.md"`);
    return;
  }

  const bundled = fs.readFileSync(bundledPath, 'utf-8');

  if (fs.existsSync(canonicalPath) && bundled !== fs.readFileSync(canonicalPath, 'utf-8')) {
    error(`Plugin "${pluginName}": Bundled skill "${skillName}" differs from skills/${skillName} - run "npm run sync"`);
    return;
  }

  const frontmatter = parseFrontmatter(bundled);
  if (!frontmatter || !frontmatter.name || !frontmatter.description) {
    error(`Plugin "${pluginName}": Bundled skill "${skillName}" has invalid frontmatter`);
  }
}

/**
 * Validate the generated marketplaces and plugin packages.
 */
function validateGeneratedOutputs(config, meta) {
  const pluginGroups = config.plugins;

  expectGenerated(MARKETPLACE_FILE, buildMarketplace(pluginGroups, meta, config.owner));
  expectGenerated(CODEX_MARKETPLACE_FILE, buildCodexMarketplace(pluginGroups));

  if (!fs.existsSync(PLUGINS_DIR)) {
    error(`Missing ${PLUGINS_DIR}/ directory for plugin packages`);
    return;
  }

  const expectedPluginNames = new Set(pluginGroups.map(plugin => plugin.name));
  for (const entry of fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || expectedPluginNames.has(entry.name)) {
      continue;
    }

    const pluginRoot = path.join(PLUGINS_DIR, entry.name);
    if (isGeneratedPluginPackage(pluginRoot)) {
      error(`${pluginRoot}: Stale plugin package - run "npm run sync"`);
    }
  }

  for (const plugin of pluginGroups) {
    expectGenerated(
      claudeManifestPath(plugin.name),
      buildClaudePluginManifest(plugin, meta.version, config.owner)
    );
    expectGenerated(
      codexManifestPath(plugin.name),
      buildCodexPluginManifest(plugin, meta.version, config.owner)
    );

    const skillsDir = pluginSkillsPath(plugin.name);
    if (!fs.existsSync(skillsDir)) {
      error(`Plugin "${plugin.name}": Missing skills/ directory`);
      continue;
    }

    const actualSkills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();
    const expectedSkills = [...plugin.skills].sort();

    if (JSON.stringify(actualSkills) !== JSON.stringify(expectedSkills)) {
      error(`Plugin "${plugin.name}": bundled skills are out of sync - run "npm run sync"`);
    }

    for (const skillName of plugin.skills) {
      validateBundledSkill(plugin.name, skillName);
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

  let meta = null;
  try {
    meta = readPackageMeta();
  } catch (e) {
    error(e.message);
  }

  const skillDirs = getSkillDirs();
  log(`Found ${skillDirs.length} skill(s) in ${SKILLS_DIR}/`);
  log('');

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
  const config = loadPluginGroups(skillDirs, error);
  log('');

  log('📦 Validating generated marketplaces and plugin packages...');
  if (config && meta) {
    validateGeneratedOutputs(config, meta);
  } else {
    log('   Skipped: fix the errors above first');
  }
  log('');

  log('=========================================');
  if (errors.length === 0) {
    success(`All validations passed! (${validSkills.length} valid skills)`);
    log('');
    process.exit(0);
  }

  log('');
  error(`Found ${errors.length} error(s)`);
  if (warnings.length > 0) {
    warn(`Found ${warnings.length} warning(s)`);
  }
  log('');
  process.exit(1);
}

main();
