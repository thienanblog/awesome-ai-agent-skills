import fs from 'fs';
import path from 'path';
import { parse as parseYaml } from 'yaml';

/**
 * Shared definition of the generated marketplace and plugin package shapes.
 *
 * scripts/sync-marketplace.js writes these shapes; scripts/validate-skills.js
 * regenerates them and diffs against what is committed. Keeping one definition
 * means a hand-edit to any generated file is caught, not just the handful of
 * fields a checker happened to spot-check.
 */

export const SKILLS_DIR = 'skills';
export const PLUGINS_DIR = 'plugins';
export const MARKETPLACE_FILE = '.claude-plugin/marketplace.json';
export const CODEX_MARKETPLACE_FILE = '.agents/plugins/marketplace.json';
export const PLUGIN_GROUPS_FILE = 'plugin-groups.json';
export const PACKAGE_FILE = 'package.json';
export const PLUGIN_SUFFIX = '-skills';
export const MARKETPLACE_NAME = 'awesome-ai-agent-skills';
export const MARKETPLACE_DISPLAY_NAME = 'Awesome AI Agent Skills';
export const REPOSITORY_URL = 'https://github.com/thienanblog/awesome-ai-agent-skills';
export const LICENSE = 'MIT';

export function pluginSourcePath(pluginName) {
  return `./${PLUGINS_DIR}/${pluginName}`;
}

export function pluginRootPath(pluginName) {
  return path.join(PLUGINS_DIR, pluginName);
}

export function claudeManifestPath(pluginName) {
  return path.join(pluginRootPath(pluginName), '.claude-plugin', 'plugin.json');
}

export function codexManifestPath(pluginName) {
  return path.join(pluginRootPath(pluginName), '.codex-plugin', 'plugin.json');
}

export function pluginSkillsPath(pluginName) {
  return path.join(pluginRootPath(pluginName), 'skills');
}

/**
 * A directory under plugins/ is ours to regenerate (and to delete when stale)
 * only if it carries one of the manifests this script writes.
 */
export function isGeneratedPluginPackage(pluginRoot) {
  return fs.existsSync(path.join(pluginRoot, '.claude-plugin', 'plugin.json')) ||
    fs.existsSync(path.join(pluginRoot, '.codex-plugin', 'plugin.json'));
}

/**
 * Parse YAML frontmatter from a markdown file.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }
  try {
    return parseYaml(match[1]);
  } catch {
    return null;
  }
}

/**
 * package.json is the single source of truth for the released version and the
 * marketplace description. Both are stamped into every generated manifest, and
 * Claude Code only ships an update when the version string changes, so a
 * missing value is fatal rather than defaulted.
 */
export function readPackageMeta() {
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf-8'));

  if (!packageJson.version) {
    throw new Error(`${PACKAGE_FILE} is missing "version"`);
  }
  if (!packageJson.description) {
    throw new Error(`${PACKAGE_FILE} is missing "description"`);
  }

  return { version: packageJson.version, description: packageJson.description };
}

function pluginKeywords(plugin) {
  return ['claude-code', 'agent-skills', ...plugin.skills.slice(0, 4)];
}

/**
 * Claude Code rejects unrecognized manifest keys as hard errors, so a key added
 * in a newer release breaks the whole marketplace for anyone on an older
 * client. These builders emit only keys accepted across releases in the wild —
 * notably no top-level "description"/"version", no per-plugin "displayName",
 * no "$schema" and no "renames". Because the validator diffs against these
 * builders, adding such a key anywhere fails the build.
 */
export function buildMarketplacePluginEntry(plugin, version, owner) {
  return {
    name: plugin.name,
    source: pluginSourcePath(plugin.name),
    description: plugin.description,
    version,
    author: owner,
    homepage: REPOSITORY_URL,
    repository: REPOSITORY_URL,
    license: LICENSE,
    keywords: pluginKeywords(plugin),
    category: 'productivity'
  };
}

export function buildMarketplace(pluginGroups, meta, owner) {
  return {
    name: MARKETPLACE_NAME,
    owner,
    metadata: {
      description: meta.description,
      version: meta.version
    },
    plugins: pluginGroups.map(plugin => buildMarketplacePluginEntry(plugin, meta.version, owner))
  };
}

export function buildClaudePluginManifest(plugin, version, owner) {
  return {
    name: plugin.name,
    version,
    description: plugin.description,
    author: owner,
    homepage: REPOSITORY_URL,
    repository: REPOSITORY_URL,
    license: LICENSE,
    keywords: pluginKeywords(plugin)
  };
}

function codexDefaultPrompts(plugin) {
  if (Array.isArray(plugin.defaultPrompts) && plugin.defaultPrompts.length > 0) {
    return [...plugin.defaultPrompts];
  }

  const primarySkill = plugin.skills[0] || plugin.name;
  return [
    `Use ${primarySkill} to guide this project task.`,
    `Apply ${plugin.name} to review this repository.`
  ];
}

export function buildCodexPluginManifest(plugin, version, owner) {
  return {
    name: plugin.name,
    version,
    description: plugin.description,
    homepage: REPOSITORY_URL,
    repository: REPOSITORY_URL,
    license: LICENSE,
    keywords: ['codex', 'skills', ...plugin.skills.slice(0, 4)],
    skills: './skills/',
    interface: {
      displayName: plugin.displayName,
      shortDescription: plugin.description,
      longDescription: plugin.description,
      developerName: owner.name,
      category: 'Productivity',
      capabilities: ['Read', 'Write'],
      websiteURL: REPOSITORY_URL,
      defaultPrompt: codexDefaultPrompts(plugin),
      brandColor: '#10A37F'
    }
  };
}

export function buildCodexMarketplace(pluginGroups) {
  return {
    name: MARKETPLACE_NAME,
    interface: {
      displayName: MARKETPLACE_DISPLAY_NAME
    },
    plugins: pluginGroups.map(plugin => ({
      name: plugin.name,
      source: {
        source: 'local',
        path: pluginSourcePath(plugin.name)
      },
      policy: {
        installation: 'AVAILABLE',
        authentication: 'ON_INSTALL'
      },
      category: 'Productivity'
    }))
  };
}

export function serialize(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

/**
 * Report which top-level keys differ, so an out-of-sync generated file points at
 * what changed instead of just saying the whole blob mismatches.
 */
export function diffKeys(actual, expected) {
  const keys = new Set([...Object.keys(actual || {}), ...Object.keys(expected || {})]);
  return [...keys].filter(key =>
    JSON.stringify(actual?.[key]) !== JSON.stringify(expected?.[key])
  );
}
