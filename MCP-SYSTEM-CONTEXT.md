# FluentCommunity MCP System Context

## Overview
This MCP server provides 127+ tools for managing WordPress and the Fluent Suite plugins through a unified API.

**IMPORTANT**: The tools are defined in the MCP server with simple names like `list_content`, `fc_create_post`, etc. However, **Cursor automatically adds the `mcp_fluent-community_` prefix** when exposing these tools to AI agents. This is a Cursor convention for all MCP tools.

So when you see a tool in Cursor, it appears as `mcp_fluent-community_list_content`, but in the MCP server code it's just `list_content`.

## Architecture

### Two-Layer System:
1. **WordPress Plugin**: `fluent-community-manager` (v3.9.0)
   - Creates bridge REST API endpoints at `/wp-json/fc-manager/v1/`
   - Proxies requests to native plugin APIs
   - Handles authentication bypass for integrated plugins
   - Located at: `C:\Users\help\OneDrive\Documents\Github\fluent-community-manager\fluent-community-manager.php`

2. **MCP Server**: `@wplaunchify/fluent-community-mcp` (v2.1.0)
   - npm package that exposes WordPress tools to AI agents
   - Published at: https://www.npmjs.com/package/@wplaunchify/fluent-community-mcp
   - Source at: `C:\Users\help\OneDrive\Documents\Github\fluent-community-mcp`

### Authentication
- Uses WordPress Application Passwords
- Plugin automatically bypasses individual plugin API key requirements
- Requires user to have `edit_posts` capability

## Available Tool Categories

### WordPress Core (15 tools)
**Note**: In Cursor, these appear with `mcp_fluent-community_` prefix (e.g., `mcp_fluent-community_list_content`)

- Content management: `list_content`, `create_content`, `update_content`, `delete_content`
- Taxonomies: `list_terms`, `create_term`, `update_term`, `delete_term`
- Users: `list_users`, `create_user`, `update_user`, `delete_user`
- Media: `list_media`, `create_media`, `edit_media`, `delete_media`
- Comments: `list_comments`, `create_comment`, `update_comment`, `delete_comment`
- Plugins: `list_plugins`, `activate_plugin`, `deactivate_plugin`, `create_plugin`

### FluentCommunity (47 tools)
**Native API Tools** (use `/fluent-community/v2/` endpoints):
- Spaces: `fc_list_spaces`, `fc_create_space`, `fc_update_space`
- Posts: `fc_list_posts`, `fc_create_post`, `fc_update_post`, `fc_delete_post`
- Comments: `fc_list_comments`, `fc_create_comment`, `fc_update_comment`, `fc_delete_comment`
- Members: `fc_list_space_members`, `fc_add_space_member`, `fc_remove_space_member`
- Search: `fc_search_content`
- Analytics: `fc_get_space_analytics`
- Bulk operations: `fc_bulk_create_posts`, `fc_bulk_update_posts`, `fc_bulk_delete_posts`

**Design & Layout Tools** (use `/fc-manager/v1/` custom endpoints):
- Colors: `fc_get_colors`, `fc_update_colors`
- Portal Settings: `fc_get_portal_settings`, `fc_update_portal_settings`
- Branding: `fc_get_branding`, `fc_update_branding`
- Layout: `fc_get_layout`, `fc_update_layout`

### FluentCRM (30 tools)
All tools proxy to `/fluent-crm/v2/` native API:
- Contacts: `fcrm_list_contacts`, `fcrm_create_contact`, `fcrm_update_contact`, `fcrm_delete_contact`
- Lists: `fcrm_list_lists`, `fcrm_create_list`, `fcrm_update_list`, `fcrm_delete_list`
- Tags: Similar pattern for tags
- Campaigns: Similar pattern for campaigns

### FluentCart (10 tools)
All tools proxy to `/fluent-cart/v2/` native API:
- Products, orders, customers, coupons, etc.

### FluentAffiliate (25 tools)
All tools proxy to `/fluent-affiliate/v2/` native API:
- Affiliates: `fa_list_affiliates`, `fa_create_affiliate`, `fa_update_affiliate`, `fa_delete_affiliate`
- Payouts: `fa_list_payouts`, `fa_create_payout`, `fa_update_payout`, `fa_delete_payout`
- Referrals: `fa_list_referrals`, `fa_get_referral`, `fa_update_referral`
- Reports: `fa_get_affiliate_report`, `fa_get_overview_stats`
- Portal Settings: `fa_get_portal_settings`, `fa_update_portal_settings`

### ML Canvas Block (2 tools)
All tools proxy to `/ml-canvas/v1/` native API:
- `canvas_create_page`: Create pages with ML Canvas blocks
- `canvas_get_api_docs`: Get API documentation

## Test Site
- URL: https://fccmanagermcp.instawp.co
- Credentials stored in: `fluent-community-mcp/mcp.json`

## Testing
Run comprehensive integration tests:
```bash
cd fluent-community-mcp
node test-all-integrations.js
```

## Recent Status
- ✅ All 22 integration tests passing (100% pass rate)
- ✅ Plugin v3.9.0 deployed and working
- ✅ MCP v2.1.0 published to npm
- ✅ All authentication bypasses working correctly

## Common Patterns

### Creating Content with ML Canvas Block
```typescript
// In Cursor, use: mcp_fluent-community_canvas_create_page
canvas_create_page({
  title: "My Page",
  content: "Your content here",
  status: "publish"
})
```

### Managing FluentCommunity Spaces
```typescript
// In Cursor, use: mcp_fluent-community_fc_list_spaces
fc_list_spaces({ limit: 20 })

// In Cursor, use: mcp_fluent-community_fc_create_space
fc_create_space({
  title: "New Space",
  description: "Space description",
  privacy: "public"
})
```

### Managing FluentCRM Contacts
```typescript
// In Cursor, use: mcp_fluent-community_fcrm_list_contacts
fcrm_list_contacts({ per_page: 50 })

// In Cursor, use: mcp_fluent-community_fcrm_create_contact
fcrm_create_contact({
  email: "user@example.com",
  first_name: "John",
  status: "subscribed"
})
```

## Important Notes

1. **All tools work through the MCP** - Don't try to call REST endpoints directly
2. **Authentication is handled automatically** - Just use the tools
3. **Tool names always start with `mcp_fluent-community_`** - This is how Cursor exposes them
4. **The plugin handles all API bypasses** - No need to manually enable individual plugin APIs
5. **Native APIs are preferred** - We're migrating custom endpoints to native API proxies where possible

## Pending Optimizations
- Replace 14 custom FC endpoints with native API proxies
- Add 35 new proxy endpoints for FC native features
- Create MCP tools for FC native features (10 tools)
- Update existing FC MCP tools to use native API

## Key Files
- Plugin: `fluent-community-manager/fluent-community-manager.php`
- MCP Source: `fluent-community-mcp/src/`
- MCP Tools: `fluent-community-mcp/src/tools/`
- Tests: `fluent-community-mcp/test-all-integrations.js`
- Documentation: `fluent-community-manager/fluent-mcp-docs.html`


## Overview
This MCP server provides 127+ tools for managing WordPress and the Fluent Suite plugins through a unified API.

**IMPORTANT**: The tools are defined in the MCP server with simple names like `list_content`, `fc_create_post`, etc. However, **Cursor automatically adds the `mcp_fluent-community_` prefix** when exposing these tools to AI agents. This is a Cursor convention for all MCP tools.

So when you see a tool in Cursor, it appears as `mcp_fluent-community_list_content`, but in the MCP server code it's just `list_content`.

## Architecture

### Two-Layer System:
1. **WordPress Plugin**: `fluent-community-manager` (v3.9.0)
   - Creates bridge REST API endpoints at `/wp-json/fc-manager/v1/`
   - Proxies requests to native plugin APIs
   - Handles authentication bypass for integrated plugins
   - Located at: `C:\Users\help\OneDrive\Documents\Github\fluent-community-manager\fluent-community-manager.php`

2. **MCP Server**: `@wplaunchify/fluent-community-mcp` (v2.1.0)
   - npm package that exposes WordPress tools to AI agents
   - Published at: https://www.npmjs.com/package/@wplaunchify/fluent-community-mcp
   - Source at: `C:\Users\help\OneDrive\Documents\Github\fluent-community-mcp`

### Authentication
- Uses WordPress Application Passwords
- Plugin automatically bypasses individual plugin API key requirements
- Requires user to have `edit_posts` capability

## Available Tool Categories

### WordPress Core (15 tools)
**Note**: In Cursor, these appear with `mcp_fluent-community_` prefix (e.g., `mcp_fluent-community_list_content`)

- Content management: `list_content`, `create_content`, `update_content`, `delete_content`
- Taxonomies: `list_terms`, `create_term`, `update_term`, `delete_term`
- Users: `list_users`, `create_user`, `update_user`, `delete_user`
- Media: `list_media`, `create_media`, `edit_media`, `delete_media`
- Comments: `list_comments`, `create_comment`, `update_comment`, `delete_comment`
- Plugins: `list_plugins`, `activate_plugin`, `deactivate_plugin`, `create_plugin`

### FluentCommunity (47 tools)
**Native API Tools** (use `/fluent-community/v2/` endpoints):
- Spaces: `fc_list_spaces`, `fc_create_space`, `fc_update_space`
- Posts: `fc_list_posts`, `fc_create_post`, `fc_update_post`, `fc_delete_post`
- Comments: `fc_list_comments`, `fc_create_comment`, `fc_update_comment`, `fc_delete_comment`
- Members: `fc_list_space_members`, `fc_add_space_member`, `fc_remove_space_member`
- Search: `fc_search_content`
- Analytics: `fc_get_space_analytics`
- Bulk operations: `fc_bulk_create_posts`, `fc_bulk_update_posts`, `fc_bulk_delete_posts`

**Design & Layout Tools** (use `/fc-manager/v1/` custom endpoints):
- Colors: `fc_get_colors`, `fc_update_colors`
- Portal Settings: `fc_get_portal_settings`, `fc_update_portal_settings`
- Branding: `fc_get_branding`, `fc_update_branding`
- Layout: `fc_get_layout`, `fc_update_layout`

### FluentCRM (30 tools)
All tools proxy to `/fluent-crm/v2/` native API:
- Contacts: `fcrm_list_contacts`, `fcrm_create_contact`, `fcrm_update_contact`, `fcrm_delete_contact`
- Lists: `fcrm_list_lists`, `fcrm_create_list`, `fcrm_update_list`, `fcrm_delete_list`
- Tags: Similar pattern for tags
- Campaigns: Similar pattern for campaigns

### FluentCart (10 tools)
All tools proxy to `/fluent-cart/v2/` native API:
- Products, orders, customers, coupons, etc.

### FluentAffiliate (25 tools)
All tools proxy to `/fluent-affiliate/v2/` native API:
- Affiliates: `fa_list_affiliates`, `fa_create_affiliate`, `fa_update_affiliate`, `fa_delete_affiliate`
- Payouts: `fa_list_payouts`, `fa_create_payout`, `fa_update_payout`, `fa_delete_payout`
- Referrals: `fa_list_referrals`, `fa_get_referral`, `fa_update_referral`
- Reports: `fa_get_affiliate_report`, `fa_get_overview_stats`
- Portal Settings: `fa_get_portal_settings`, `fa_update_portal_settings`

### ML Canvas Block (2 tools)
All tools proxy to `/ml-canvas/v1/` native API:
- `canvas_create_page`: Create pages with ML Canvas blocks
- `canvas_get_api_docs`: Get API documentation

## Test Site
- URL: https://fccmanagermcp.instawp.co
- Credentials stored in: `fluent-community-mcp/mcp.json`

## Testing
Run comprehensive integration tests:
```bash
cd fluent-community-mcp
node test-all-integrations.js
```

## Recent Status
- ✅ All 22 integration tests passing (100% pass rate)
- ✅ Plugin v3.9.0 deployed and working
- ✅ MCP v2.1.0 published to npm
- ✅ All authentication bypasses working correctly

## Common Patterns

### Creating Content with ML Canvas Block
```typescript
// In Cursor, use: mcp_fluent-community_canvas_create_page
canvas_create_page({
  title: "My Page",
  content: "Your content here",
  status: "publish"
})
```

### Managing FluentCommunity Spaces
```typescript
// In Cursor, use: mcp_fluent-community_fc_list_spaces
fc_list_spaces({ limit: 20 })

// In Cursor, use: mcp_fluent-community_fc_create_space
fc_create_space({
  title: "New Space",
  description: "Space description",
  privacy: "public"
})
```

### Managing FluentCRM Contacts
```typescript
// In Cursor, use: mcp_fluent-community_fcrm_list_contacts
fcrm_list_contacts({ per_page: 50 })

// In Cursor, use: mcp_fluent-community_fcrm_create_contact
fcrm_create_contact({
  email: "user@example.com",
  first_name: "John",
  status: "subscribed"
})
```

## Important Notes

1. **All tools work through the MCP** - Don't try to call REST endpoints directly
2. **Authentication is handled automatically** - Just use the tools
3. **Tool names always start with `mcp_fluent-community_`** - This is how Cursor exposes them
4. **The plugin handles all API bypasses** - No need to manually enable individual plugin APIs
5. **Native APIs are preferred** - We're migrating custom endpoints to native API proxies where possible

## Pending Optimizations
- Replace 14 custom FC endpoints with native API proxies
- Add 35 new proxy endpoints for FC native features
- Create MCP tools for FC native features (10 tools)
- Update existing FC MCP tools to use native API

## Key Files
- Plugin: `fluent-community-manager/fluent-community-manager.php`
- MCP Source: `fluent-community-mcp/src/`
- MCP Tools: `fluent-community-mcp/src/tools/`
- Tests: `fluent-community-mcp/test-all-integrations.js`
- Documentation: `fluent-community-manager/fluent-mcp-docs.html`


