import fs from 'fs';
import { PLUGIN_GROUPS_FILE, PLUGIN_SUFFIX } from './plugin-shape.js';

/**
 * Read and rule-check plugin-groups.json, the source of truth for plugin
 * membership and identity.
 *
 * `onError` decides the reaction: the generator exits on the first problem
 * because it must not write a broken marketplace, while the validator
 * accumulates so one run reports everything.
 */
export function loadPluginGroups(skillFolderNames, onError) {
  if (!fs.existsSync(PLUGIN_GROUPS_FILE)) {
    onError(`Missing ${PLUGIN_GROUPS_FILE}`);
    return null;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(PLUGIN_GROUPS_FILE, 'utf-8'));
  } catch (e) {
    onError(`${PLUGIN_GROUPS_FILE}: Invalid JSON - ${e.message}`);
    return null;
  }

  if (!config || !Array.isArray(config.plugins)) {
    onError(`${PLUGIN_GROUPS_FILE}: Missing or invalid "plugins" array`);
    return null;
  }

  // The owner is stamped into the marketplace and every plugin manifest, so it
  // has to be authored here rather than recovered from a generated file.
  if (!config.owner || !config.owner.name) {
    onError(`${PLUGIN_GROUPS_FILE}: Missing "owner.name"`);
  }

  const knownSkills = new Set(skillFolderNames);
  const assignedSkills = new Set();
  const pluginNames = new Set();

  for (const plugin of config.plugins) {
    if (!plugin.name) {
      onError(`${PLUGIN_GROUPS_FILE}: Plugin missing "name"`);
      continue;
    }
    if (pluginNames.has(plugin.name)) {
      onError(`${PLUGIN_GROUPS_FILE}: Duplicate plugin "${plugin.name}"`);
    }
    pluginNames.add(plugin.name);

    if (!plugin.name.endsWith(PLUGIN_SUFFIX)) {
      onError(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" must end with "${PLUGIN_SUFFIX}"`);
    }
    if (!plugin.displayName) {
      onError(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "displayName"`);
    }
    if (!plugin.description) {
      onError(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "description"`);
    }
    if (!Array.isArray(plugin.skills) || plugin.skills.length === 0) {
      onError(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" missing "skills" array`);
      continue;
    }

    for (const skillName of plugin.skills) {
      if (!knownSkills.has(skillName)) {
        onError(`${PLUGIN_GROUPS_FILE}: Plugin "${plugin.name}" references unknown skill "${skillName}"`);
        continue;
      }
      if (assignedSkills.has(skillName)) {
        onError(`${PLUGIN_GROUPS_FILE}: Skill "${skillName}" listed in multiple plugins`);
        continue;
      }
      assignedSkills.add(skillName);
    }
  }

  for (const skillName of skillFolderNames) {
    if (!assignedSkills.has(skillName)) {
      onError(`${PLUGIN_GROUPS_FILE}: Skill "${skillName}" not assigned to any plugin`);
    }
  }

  return config;
}
