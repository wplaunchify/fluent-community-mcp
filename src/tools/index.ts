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
import { fluentCommunityDesignTools, fluentCommunityDesignHandlers } from './fluent-community-design.js';
import { fluentCommunityLayoutTools, fluentCommunityLayoutHandlers } from './fluent-community-layout.js';
import { fluentCartTools, fluentCartHandlers } from './fluent-cart.js';
import { fluentCRMTools, fluentCRMHandlers } from './fluent-crm.js';
import { mlCanvasTools, mlCanvasHandlers } from './ml-canvas.js';
import { mlImageEditorTools, mlImageEditorHandlers } from './ml-image-editor.js';
import { fluentAffiliateTools, fluentAffiliateHandlers } from './fluent-affiliate.js';
import { mlMediaHubTools, mlMediaHubHandlers } from './ml-media-hub.js';

// Combine all tools - WordPress + FluentCommunity + FluentCRM + FluentCart + FluentAffiliate + ML Canvas + ML Image Editor + ML Media Hub = 153+ tools
export const allTools: Tool[] = [
  ...unifiedContentTools,        // 8 tools (replaces posts, pages, custom-post-types)
  ...unifiedTaxonomyTools,       // 8 tools (replaces categories, custom-taxonomies)
  ...pluginTools,               // ~5 tools
  ...mediaTools,                // ~5 tools
  ...userTools,                 // ~5 tools
  ...pluginRepositoryTools,     // ~2 tools
  ...commentTools,              // ~5 tools
  ...fluentCommunityTools,      // 22 tools (FluentCommunity management)
  ...fluentCommunityDesignTools, // 6 tools (FluentCommunity design/styling)
  ...fluentCommunityLayoutTools, // 2 tools (FluentCommunity layout control)
  ...fluentCRMTools,            // 20 tools (FluentCRM management)
  ...fluentCartTools,           // 16 tools (FluentCart e-commerce)
  ...fluentAffiliateTools,      // 25 tools (FluentAffiliate marketing)
  ...mlCanvasTools,             // 3 tools (ML Canvas Block custom pages + surgical editing)
  ...mlImageEditorTools,        // 8 tools (ML Image Editor AI generation/editing)
  ...mlMediaHubTools            // 10 tools (ML Media Hub P2P image search & icon import)
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
  ...fluentCommunityHandlers,
  ...fluentCommunityDesignHandlers,
  ...fluentCommunityLayoutHandlers,
  ...fluentCRMHandlers,
  ...fluentCartHandlers,
  ...fluentAffiliateHandlers,
  ...mlCanvasHandlers,
  ...mlImageEditorHandlers,
  ...mlMediaHubHandlers
};
