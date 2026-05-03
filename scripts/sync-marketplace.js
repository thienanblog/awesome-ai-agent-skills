#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

const SKILLS_DIR = 'skills';
const MARKETPLACE_FILE = '.claude-plugin/marketplace.json';
const CODEX_MARKETPLACE_FILE = '.agents/plugins/marketplace.json';
const CODEX_PLUGINS_DIR = 'plugins';
const README_FILE = 'README.md';
const PLUGIN_GROUPS_FILE = 'plugin-groups.json';
const PLUGIN_SUFFIX = '-skills';
const PLUGINS_TABLE_START = '<!-- PLUGINS_TABLE_START -->';
const PLUGINS_TABLE_END = '<!-- PLUGINS_TABLE_END -->';
const REPOSITORY_URL = 'https://github.com/thienanblog/awesome-ai-agent-skills';

function log(message) {
  console.log(message);
}

function success(message) {
  console.log(`✅ ${message}`);
}

function readPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    return packageJson.version || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

function titleCasePluginName(pluginName) {
  return pluginName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function buildCodexDefaultPrompts(pluginName, skillNames) {
  const primarySkill = skillNames[0] || pluginName;
  const prompts = [
    `Use ${primarySkill} to guide this project task.`,
    `Apply ${pluginName} to review this repository.`
  ];

  if (skillNames.length > 1) {
    prompts.push(`Use ${pluginName} to plan docs and delivery.`);
  }

  return prompts;
}

function loadPluginGroups(skills) {
  if (!fs.existsSync(PLUGIN_GROUPS_FILE)) {
    log(`❌ Missing ${PLUGIN_GROUPS_FILE}. Add plugin groups to continue.`);
    process.exit(1);
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(PLUGIN_GROUPS_FILE, 'utf-8'));
  } catch (e) {
    log(`❌ ${PLUGIN_GROUPS_FILE}: Invalid JSON - ${e.message}`);
    process.exit(1);
  }

  if (!config || !Array.isArray(config.plugins)) {
    log(`❌ ${PLUGIN_GROUPS_FILE}: Missing "plugins" array`);
    process.exit(1);
  }

  const skillMap = new Map(skills.map(skill => [skill.folderName, skill]));
  const assignedSkills = new Set();
  let hasErrors = false;

  for (const plugin of config.plugins) {
    if (!plugin.name) {
      log(`❌ ${PLUGIN_GROUPS_FILE}: Plugin missing "name"`);
      hasErrors = true;
      continue;
    }
    if (!plugin.description) {
      log(`❌ ${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "description"`);
      hasErrors = true;
    }
    if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
      log(`❌ ${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "skills" array`);
      hasErrors = true;
      continue;
    }
    if (!plugin.name.endsWith(PLUGIN_SUFFIX)) {
      log(`❌ ${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" must end with "${PLUGIN_SUFFIX}"`);
      hasErrors = true;
    }

    for (const skillName of plugin.skills) {
      if (!skillMap.has(skillName)) {
        log(`❌ ${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" references unknown skill "${skillName}"`);
        hasErrors = true;
        continue;
      }
      if (assignedSkills.has(skillName)) {
        log(`❌ ${PLUGIN_GROUPS_FILE}: Skill "${skillName}" listed in multiple plugins`);
        hasErrors = true;
        continue;
      }
      assignedSkills.add(skillName);
    }
  }

  for (const skill of skills) {
    if (!assignedSkills.has(skill.folderName)) {
      log(`❌ ${PLUGIN_GROUPS_FILE}: Skill "${skill.folderName}" not assigned to any plugin`);
      hasErrors = true;
    }
  }

  if (hasErrors) {
    process.exit(1);
  }

  return config.plugins;
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
 * Each plugin group defines the skills users can install as a bundle.
 */
function updateMarketplace(skills, pluginGroups) {
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
      marketplace.plugins = Array.isArray(existing.plugins) ? existing.plugins : marketplace.plugins;
    } catch (e) {
      log(`⚠️  Could not read existing marketplace.json: ${e.message}`);
    }
  }

  // Get existing plugin names for comparison
  const existingPluginNames = new Set(
    marketplace.plugins?.map(p => p.name) || []
  );

  // Build one plugin per domain group
  // Each plugin has source: "./" and skills array with matching skill paths
  marketplace.plugins = pluginGroups.map(plugin => ({
    name: plugin.name,
    description: plugin.description,
    source: './',
    strict: false,
    skills: plugin.skills.map(skillName => `./skills/${skillName}`)
  }));

  // Determine changes
  const newPluginNames = new Set(pluginGroups.map(p => p.name));
  const added = pluginGroups.filter(p => !existingPluginNames.has(p.name)).map(p => p.name);
  const removed = [...existingPluginNames].filter(name => !newPluginNames.has(name));

  // Write marketplace.json
  fs.writeFileSync(
    MARKETPLACE_FILE,
    JSON.stringify(marketplace, null, 2) + '\n'
  );

  return { added, removed };
}

function buildCodexMarketplace(pluginGroups) {
  return {
    name: 'awesome-ai-agent-skills',
    interface: {
      displayName: 'Awesome AI Agent Skills'
    },
    plugins: pluginGroups.map(plugin => ({
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
    }))
  };
}

function buildCodexPluginManifest(plugin, version) {
  const displayName = titleCasePluginName(plugin.name);

  return {
    name: plugin.name,
    version,
    description: plugin.description,
    homepage: REPOSITORY_URL,
    repository: REPOSITORY_URL,
    license: 'MIT',
    keywords: [
      'codex',
      'skills',
      ...plugin.skills.slice(0, 4)
    ],
    skills: './skills/',
    interface: {
      displayName,
      shortDescription: plugin.description,
      longDescription: plugin.description,
      developerName: 'Ân Vũ',
      category: 'Productivity',
      capabilities: ['Read', 'Write'],
      websiteURL: REPOSITORY_URL,
      defaultPrompt: buildCodexDefaultPrompts(plugin.name, plugin.skills),
      brandColor: '#10A37F'
    }
  };
}

function copyPluginSkills(plugin) {
  const pluginRoot = path.join(CODEX_PLUGINS_DIR, plugin.name);
  const pluginSkillsDir = path.join(pluginRoot, 'skills');

  fs.rmSync(pluginSkillsDir, { recursive: true, force: true });
  fs.mkdirSync(pluginSkillsDir, { recursive: true });

  for (const skillName of plugin.skills) {
    const sourceDir = path.join(SKILLS_DIR, skillName);
    const targetDir = path.join(pluginSkillsDir, skillName);
    fs.cpSync(sourceDir, targetDir, {
      recursive: true,
      filter: source => path.basename(source) !== '.DS_Store'
    });
  }
}

function removeStaleCodexPlugins(pluginGroups) {
  if (!fs.existsSync(CODEX_PLUGINS_DIR)) {
    return;
  }

  const expectedPluginNames = new Set(pluginGroups.map(plugin => plugin.name));
  const entries = fs.readdirSync(CODEX_PLUGINS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || expectedPluginNames.has(entry.name)) {
      continue;
    }

    const manifestPath = path.join(CODEX_PLUGINS_DIR, entry.name, '.codex-plugin', 'plugin.json');
    if (fs.existsSync(manifestPath)) {
      fs.rmSync(path.join(CODEX_PLUGINS_DIR, entry.name), { recursive: true, force: true });
    }
  }
}

function updateCodexPlugins(pluginGroups) {
  const version = readPackageVersion();

  fs.mkdirSync(CODEX_PLUGINS_DIR, { recursive: true });
  removeStaleCodexPlugins(pluginGroups);

  for (const plugin of pluginGroups) {
    const pluginRoot = path.join(CODEX_PLUGINS_DIR, plugin.name);
    const manifestPath = path.join(pluginRoot, '.codex-plugin', 'plugin.json');

    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(buildCodexPluginManifest(plugin, version), null, 2) + '\n'
    );
    copyPluginSkills(plugin);
  }

  fs.mkdirSync(path.dirname(CODEX_MARKETPLACE_FILE), { recursive: true });
  fs.writeFileSync(
    CODEX_MARKETPLACE_FILE,
    JSON.stringify(buildCodexMarketplace(pluginGroups), null, 2) + '\n'
  );
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
 * Update README.md plugin groups table
 */
function updateReadmePluginGroups(content, pluginGroups) {
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

  // Fallback: try to find existing table under "## Plugin Groups"
  const tableRegex = /(## Plugin Groups\s*\n+[\s\S]*?\n)\|[^\n]+\|\n\|[-|]+\|\n(\|[^\n]+\|\n?)*/;
  if (tableRegex.test(content)) {
    return content.replace(tableRegex, `$1${newTable}\n`);
  }

  log(`⚠️  Could not find plugin groups table in README.md. Add markers manually.`);
  return content;
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

  // Load plugin groups
  const pluginGroups = loadPluginGroups(skills);

  // Update marketplace.json
  log('🧩 Updating marketplace.json...');
  const { added, removed } = updateMarketplace(skills, pluginGroups);

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
  if (readmeUpdated) success('README.md skills table updated');

  // Update README.md plugin groups table (best-effort)
  let readmeContent = fs.readFileSync(README_FILE, 'utf-8');
  const nextReadmeContent = updateReadmePluginGroups(readmeContent, pluginGroups);
  if (nextReadmeContent !== readmeContent) {
    fs.writeFileSync(README_FILE, nextReadmeContent);
    success('README.md plugin groups table updated');
  }
  log('');

  log('🔌 Updating Codex plugins...');
  updateCodexPlugins(pluginGroups);
  success('Codex marketplace and plugin packages updated');
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
