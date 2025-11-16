// src/tools/index.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { unifiedContentTools, unifiedContentHandlers } from './unified-content.js';
import { unifiedTaxonomyTools, unifiedTaxonomyHandlers } from './unified-taxonomies.js';
import { pluginTools, pluginHandlers } from './plugins.js';
import { mediaTools, mediaHandlers } from './media.js';
import { userTools, userHandlers } from './users.js';
import { pluginRepositoryTools, pluginRepositoryHandlers } from './plugin-repository.js';
import { commentTools, commentHandlers } from './comments.js';
import { fluentCommunityTools, fluentCommunityHandlers } from './fluent-community.js';

// Combine all tools - WordPress + FluentCommunity = ~60 tools
export const allTools: Tool[] = [
  ...unifiedContentTools,        // 8 tools (replaces posts, pages, custom-post-types)
  ...unifiedTaxonomyTools,       // 8 tools (replaces categories, custom-taxonomies)
  ...pluginTools,               // ~5 tools
  ...mediaTools,                // ~5 tools
  ...userTools,                 // ~5 tools
  ...pluginRepositoryTools,     // ~2 tools
  ...commentTools,              // ~5 tools
  ...fluentCommunityTools       // 22 tools (FluentCommunity management)
];

// Combine all handlers
export const toolHandlers = {
  ...unifiedContentHandlers,
  ...unifiedTaxonomyHandlers,
  ...pluginHandlers,
  ...mediaHandlers,
  ...userHandlers,
  ...pluginRepositoryHandlers,
  ...commentHandlers,
  ...fluentCommunityHandlers
};