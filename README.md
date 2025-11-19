# Fluent Community MCP Server

**Version 2.0.0** - Universal Model Context Protocol server for WordPress and the complete Fluent Suite ecosystem.

[![npm version](https://badge.fury.io/js/%40wplaunchify%2Ffluent-community-mcp.svg)](https://www.npmjs.com/package/@wplaunchify/fluent-community-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Overview

This MCP server provides **90+ AI-powered tools** for managing WordPress and the Fluent Suite of plugins:

- **WordPress Core** (38 tools): Posts, pages, custom post types, media, users, plugins, comments, taxonomies
- **FluentCommunity** (30 tools): Spaces, posts, comments, members, search, analytics, design, layout
- **FluentCRM** (20 tools): Contacts, campaigns, lists, tags, email marketing
- **FluentCart** (16 tools): Products, orders, customers, coupons, analytics
- **ML Canvas Block** (2 tools): Custom HTML/CSS page creation, landing pages, full-width designs

Perfect for AI agents like **Claude Desktop** and **Cursor IDE** to automate your WordPress site management.

## 📦 Installation

### Quick Start (Cursor IDE)

1. **Install the WordPress Plugin**
   - Download `fluent-community-manager.zip` (v3.7.0+)
   - Upload to WordPress: Plugins → Add New → Upload Plugin
   - Activate the plugin

2. **Generate MCP Credentials**
   - Go to WordPress Admin → Fluent Community Manager
   - Click "MCP Setup" tab
   - Click "Generate Application Password"
   - Copy the JSON configuration

3. **Configure Cursor**
   - Open `~/.cursor/mcp.json` (create if doesn't exist)
   - Add the configuration:

```json
{
  "mcpServers": {
    "fluent-community": {
      "command": "npx",
      "args": [
        "-y",
        "@wplaunchify/fluent-community-mcp@latest"
      ],
      "env": {
        "WORDPRESS_API_URL": "https://yoursite.com",
        "WORDPRESS_USERNAME": "your-username",
        "WORDPRESS_APP_PASSWORD": "your-app-password"
      }
    }
  }
}
```

4. **Restart Cursor** - The tools will appear automatically!

### Claude Desktop Setup

Same steps, but edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows).

## 🛠️ Available Tools

### WordPress Core Tools (38 tools)

**Content Management:**
- `list_content` - List posts, pages, or custom post types
- `get_content` - Get specific content by ID
- `create_content` - Create new content
- `update_content` - Update existing content
- `delete_content` - Delete content
- `find_content_by_url` - Find content by URL
- `get_content_by_slug` - Find content by slug
- `discover_content_types` - List all available content types

**Taxonomy Management:**
- `discover_taxonomies` - List all taxonomies
- `list_terms` - List terms in a taxonomy
- `get_term` - Get specific term
- `create_term` - Create new term
- `update_term` - Update term
- `delete_term` - Delete term
- `assign_terms_to_content` - Assign terms to content
- `get_content_terms` - Get all terms for content

**Media Management:**
- `list_media` - List media files
- `create_media` - Upload new media
- `edit_media` - Edit media metadata
- `delete_media` - Delete media

**User Management:**
- `list_users` - List WordPress users
- `get_user` - Get user details
- `create_user` - Create new user
- `update_user` - Update user
- `delete_user` - Delete user

**Plugin Management:**
- `list_plugins` - List installed plugins
- `get_plugin` - Get plugin details
- `activate_plugin` - Activate plugin
- `deactivate_plugin` - Deactivate plugin
- `create_plugin` - Install plugin from WordPress.org
- `search_plugin_repository` - Search WordPress.org plugins
- `get_plugin_details` - Get plugin info from repository

**Comments:**
- `list_comments` - List comments
- `get_comment` - Get comment details
- `create_comment` - Create comment
- `update_comment` - Update comment
- `delete_comment` - Delete comment

### FluentCommunity Tools (30 tools)

**Space Management:**
- `fc_list_spaces` - List all community spaces
- `fc_get_space` - Get space details
- `fc_create_space` - Create new space
- `fc_update_space` - Update space
- `fc_list_space_members` - List space members
- `fc_add_space_member` - Add member to space
- `fc_remove_space_member` - Remove member from space

**Post Management:**
- `fc_list_posts` - List community posts
- `fc_get_post` - Get post details
- `fc_create_post` - Create new post
- `fc_update_post` - Update post
- `fc_delete_post` - Delete post
- `fc_bulk_create_posts` - Create multiple posts
- `fc_bulk_update_posts` - Update multiple posts
- `fc_bulk_delete_posts` - Delete multiple posts

**Comment Management:**
- `fc_list_comments` - List comments
- `fc_create_comment` - Create comment
- `fc_update_comment` - Update comment
- `fc_delete_comment` - Delete comment

**Search & Analytics:**
- `fc_search_content` - Search posts, comments, spaces
- `fc_get_space_analytics` - Get space analytics

**Design & Styling:**
- `fc_get_colors` - Get color scheme (light/dark mode)
- `fc_update_colors` - Update color scheme
- `fc_get_portal_settings` - Get portal settings
- `fc_update_portal_settings` - Update portal settings
- `fc_get_branding` - Get branding settings
- `fc_update_branding` - Update branding (logo, CSS, etc.)

**Layout Control:**
- `fc_get_layout` - Get layout settings
- `fc_update_layout` - Update layout (menu, sidebar, components)

### FluentCRM Tools (46 tools)

**Contact Management:**
- `fcrm_list_contacts` - List CRM contacts
- `fcrm_get_contact` - Get contact details
- `fcrm_create_contact` - Create new contact
- `fcrm_update_contact` - Update contact
- `fcrm_delete_contact` - Delete contact
- `fcrm_search_contacts` - Search contacts

**List Management:**
- `fcrm_list_lists` - List all contact lists
- `fcrm_get_list` - Get list details
- `fcrm_create_list` - Create new list
- `fcrm_update_list` - Update list
- `fcrm_delete_list` - Delete list
- `fcrm_add_contact_to_list` - Add contact to list
- `fcrm_remove_contact_from_list` - Remove contact from list

**Tag Management:**
- `fcrm_list_tags` - List all tags
- `fcrm_get_tag` - Get tag details
- `fcrm_create_tag` - Create new tag
- `fcrm_update_tag` - Update tag
- `fcrm_delete_tag` - Delete tag
- `fcrm_add_tag_to_contact` - Tag a contact
- `fcrm_remove_tag_from_contact` - Remove tag from contact

**Campaign Management:**
- `fcrm_list_campaigns` - List email campaigns
- `fcrm_get_campaign` - Get campaign details
- `fcrm_create_campaign` - Create new campaign
- `fcrm_update_campaign` - Update campaign
- `fcrm_delete_campaign` - Delete campaign
- `fcrm_send_campaign` - Send campaign

**Automation:**
- `fcrm_list_automations` - List automation funnels
- `fcrm_get_automation` - Get automation details
- `fcrm_create_automation` - Create automation
- `fcrm_update_automation` - Update automation
- `fcrm_delete_automation` - Delete automation

**Email Sequences:**
- `fcrm_list_sequences` - List email sequences
- `fcrm_get_sequence` - Get sequence details
- `fcrm_create_sequence` - Create sequence
- `fcrm_update_sequence` - Update sequence
- `fcrm_delete_sequence` - Delete sequence

**Forms & Webhooks:**
- `fcrm_list_forms` - List forms
- `fcrm_get_form` - Get form details
- `fcrm_list_webhooks` - List webhooks
- `fcrm_create_webhook` - Create webhook
- `fcrm_delete_webhook` - Delete webhook

**Analytics:**
- `fcrm_get_contact_activity` - Get contact activity
- `fcrm_get_campaign_stats` - Get campaign statistics

### FluentCart Tools (16 tools)

**Product Management:**
- `fcart_list_products` - List products
- `fcart_get_product` - Get product details
- `fcart_create_product` - Create new product
- `fcart_update_product` - Update product
- `fcart_delete_product` - Delete product

**Order Management:**
- `fcart_list_orders` - List orders
- `fcart_get_order` - Get order details
- `fcart_create_order` - Create new order
- `fcart_update_order` - Update order status

**Customer Management:**
- `fcart_list_customers` - List customers
- `fcart_get_customer` - Get customer details

**Coupon Management:**
- `fcart_list_coupons` - List discount coupons
- `fcart_create_coupon` - Create new coupon
- `fcart_update_coupon` - Update coupon
- `fcart_delete_coupon` - Delete coupon

**Analytics:**
- `fcart_get_analytics` - Get store analytics

### ML Canvas Block Tools (2 tools)

**Page Creation:**
- `mlcanvas_create_page` - Create custom HTML/CSS pages
- `mlcanvas_get_docs` - Get ML Canvas API documentation

## 📚 Usage Examples

### Create a Community Post

```typescript
// Using fc_create_post tool
{
  "space_id": 1,
  "user_id": 1,
  "title": "Welcome to Our Community!",
  "message": "<h2>Hello Everyone!</h2><p>We're excited to have you here.</p>",
  "type": "text",
  "status": "published",
  "privacy": "public"
}
```

### Update Community Colors

```typescript
// Using fc_update_colors tool
{
  "mode": "light",
  "colors": {
    "navbar_bg": "#1a202c",
    "navbar_text": "#ffffff",
    "accent_color": "#3182ce",
    "button_primary": "#3182ce",
    "link_color": "#2b6cb0"
  }
}
```

### Create FluentCRM Contact

```typescript
// Using fcrm_create_contact tool
{
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "status": "subscribed",
  "tags": ["customer", "vip"],
  "lists": [1, 2]
}
```

### Create FluentCart Product

```typescript
// Using fcart_create_product tool
{
  "name": "Premium Membership",
  "description": "Access to all premium features",
  "price": 99.00,
  "sale_price": 79.00,
  "sku": "PREM-001",
  "status": "publish"
}
```

### Create ML Canvas Page

```typescript
// Using mlcanvas_create_page tool
{
  "title": "Landing Page",
  "html": "<div style='background:linear-gradient(135deg,#667eea,#764ba2);padding:100px;text-align:center;'><h1 style='color:white;font-size:4rem;'>Welcome</h1></div>",
  "css": "h1 { text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }",
  "hideHeader": true,
  "hideFooter": true,
  "canvasMode": true,
  "hideTitle": true,
  "status": "publish"
}
```

## 🔧 Configuration

### Environment Variables

- `WORDPRESS_API_URL` - Your WordPress site URL (required)
- `WORDPRESS_USERNAME` - WordPress username (required)
- `WORDPRESS_APP_PASSWORD` - Application password (required)

### Plugin Requirements

- **WordPress 5.8+**
- **Fluent Community Manager Plugin v3.8.0+** (required)
- **FluentCommunity Plugin** (optional, for community tools)
- **FluentCRM Plugin** (optional, for CRM tools)
- **FluentCart Plugin** (optional, for e-commerce tools)
- **ML Canvas Block Plugin** (optional, for custom page creation)

## 🔐 Security

- Uses WordPress Application Passwords for authentication
- All requests require `manage_options` capability
- Supports WordPress nonces and REST API authentication
- No API keys stored in code - all credentials via environment variables

## 🐛 Troubleshooting

### Tools Not Appearing

1. Restart Cursor/Claude Desktop completely
2. Clear npx cache: `npx clear-npx-cache`
3. Verify `mcp.json` configuration
4. Check WordPress plugin is activated

### 404 Errors

- Ensure Fluent Community Manager plugin v3.7.0+ is installed
- Check WordPress permalink settings (must not be "Plain")
- Verify Application Password is correct (no spaces)

### Permission Errors

- User must have `manage_options` capability (Administrator role)
- Check Application Password hasn't expired
- Verify WordPress user exists and is active

## 📖 Documentation

- **Plugin Documentation**: See `fluent-community-manager.php` header
- **FluentCommunity API**: https://fluentcommunity.co/docs/
- **FluentCRM API**: https://fluentcrm.com/docs/rest-api/
- **FluentCart API**: https://dev.fluentcart.com/api/
- **WordPress REST API**: https://developer.wordpress.org/rest-api/

## 🎯 Black Friday 2025 Package

This MCP server is part of the **MinuteLaunch Black Friday 2025** offering, providing complete AI-powered automation for:

- Community management
- Email marketing
- E-commerce operations
- Content creation
- Customer relationship management

## 🤝 Contributing

This is a proprietary package developed by **1WD LLC** for the MinuteLaunch ecosystem.

## 📄 License

MIT License - Copyright © 2025 1WD LLC

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/@wplaunchify/fluent-community-mcp
- **GitHub**: https://github.com/wplaunchify/fluent-community-mcp
- **Support**: https://minutelaunch.com/support

## 🎉 What's New in v2.0.0

- ✅ **FluentCRM Integration** - 46 new tools for email marketing automation
- ✅ **FluentCart Integration** - 16 new tools for e-commerce management
- ✅ **ML Canvas Block Integration** - 2 new tools for custom page creation
- ✅ **Layout Control** - Customize FluentCommunity portal layout
- ✅ **Enhanced Design Tools** - Complete theming and branding control
- ✅ **112+ Total Tools** - Comprehensive WordPress + Fluent Suite + ML Canvas coverage
- ✅ **Better Documentation** - Complete API reference and examples
- ✅ **Improved Error Handling** - Better error messages and debugging

---

**Made with ❤️ by 1WD LLC for the MinuteLaunch Community**
