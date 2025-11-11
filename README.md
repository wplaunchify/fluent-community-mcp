# FluentCommunity Manager - MCP Integration

**Version 2.0.0** - AI-Powered Content Management for FluentCommunity

## Overview

FluentCommunity Manager is a WordPress plugin that provides powerful editing tools AND a complete MCP (Model Context Protocol) server for AI-powered management of your FluentCommunity content. This enables AI assistants like Claude to interact directly with your community through natural language.

## Features

### WordPress Plugin Features
- ✅ Visual admin interface for managing all FluentCommunity content
- ✅ Bulk operations (edit, delete multiple items)
- ✅ Advanced search across all content types
- ✅ Direct database access to FluentCommunity tables
- ✅ Export data for LLM analysis
- ✅ Embed WordPress pages/posts into community feeds
- ✅ Featured image support
- ✅ Scheduling support (FluentCommunity Pro)

### MCP Server Features
- 🤖 **Full REST API** for AI integration
- 🤖 **26+ MCP Tools** for content management
- 🤖 **Posts Management**: Create, read, update, delete posts
- 🤖 **Spaces Management**: Manage community spaces
- 🤖 **Comments**: Handle post comments and replies
- 🤖 **Members**: Add/remove space members
- 🤖 **Chat**: Manage chat threads and messages
- 🤖 **Search**: Powerful search across all content
- 🤖 **Analytics**: Get space statistics
- 🤖 **Bulk Operations**: Create/update/delete multiple items at once

## Installation

### 1. Install WordPress Plugin

1. Upload the `fluent-community-manager` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The plugin will automatically register REST API endpoints at `/wp-json/fc-manager/v1/`

### 2. Setup MCP Server

```bash
cd fluent-community-manager
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Your WordPress site URL
WP_SITE_URL=https://your-site.com

# WordPress Application Password (recommended)
# Go to: WordPress Admin → Users → Your Profile → Application Passwords
WP_USERNAME=your-username
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

# Database prefixes (usually these defaults are correct)
WP_DB_PREFIX=wp_
FC_TABLE_PREFIX=fcom_
```

### 4. Configure Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "fluent-community": {
      "command": "node",
      "args": [
        "C:\\Users\\help\\OneDrive\\Documents\\Github\\fluent-community-manager\\index.js"
      ],
      "env": {
        "WP_SITE_URL": "https://your-site.com",
        "WP_USERNAME": "your-username",
        "WP_APP_PASSWORD": "your-app-password",
        "WP_DB_PREFIX": "wp_",
        "FC_TABLE_PREFIX": "fcom_"
      }
    }
  }
}
```

### 5. Restart Claude Desktop

Close and reopen Claude Desktop. You should now see the FluentCommunity tools available!

## Usage Examples

### Example 1: Create Multiple Scheduled Posts

```
Hey Claude, create 4 engaging poll posts for my tech community (space ID 5) 
about AI trends, scheduled across the next 4 days, one per day at 9am.
```

Claude will use the `fc_bulk_create_posts` tool to create all posts at once with proper scheduling.

### Example 2: Search and Update Content

```
Find all posts in space 3 that mention "WordPress" and update them to add 
a note about our upcoming webinar.
```

Claude will:
1. Use `fc_search_content` to find matching posts
2. Use `fc_bulk_update_posts` to add the note to all of them

### Example 3: Analyze Community Engagement

```
Show me analytics for space ID 7 - how many posts, members, and comments 
do we have? Then list the top 5 most recent posts.
```

Claude will use `fc_get_space_analytics` and `fc_list_posts` to provide comprehensive stats.

### Example 4: Manage Space Members

```
Add users 15, 23, and 47 to the "Premium Members" space (ID 12)
```

Claude will use `fc_add_space_member` for each user.

## Available MCP Tools

### Posts
- `fc_list_posts` - List posts with filtering
- `fc_get_post` - Get single post details
- `fc_create_post` - Create new post
- `fc_update_post` - Update existing post
- `fc_delete_post` - Delete post
- `fc_bulk_create_posts` - Create multiple posts (great for AI content campaigns!)
- `fc_bulk_update_posts` - Update multiple posts
- `fc_bulk_delete_posts` - Delete multiple posts

### Spaces
- `fc_list_spaces` - List all spaces
- `fc_get_space` - Get space details
- `fc_create_space` - Create new space
- `fc_update_space` - Update space
- `fc_get_space_analytics` - Get space statistics

### Comments
- `fc_list_comments` - List comments
- `fc_create_comment` - Add comment to post
- `fc_update_comment` - Update comment
- `fc_delete_comment` - Delete comment

### Space Members
- `fc_list_space_members` - List members of a space
- `fc_add_space_member` - Add user to space
- `fc_remove_space_member` - Remove user from space

### Chat
- `fc_list_chat_threads` - List chat conversations
- `fc_list_chat_messages` - Get messages in thread
- `fc_send_chat_message` - Send chat message

### Search & Analytics
- `fc_search_content` - Search across all content types
- `fc_get_space_analytics` - Get detailed space statistics

### Terms/Tags
- `fc_list_terms` - List all terms/tags
- `fc_create_term` - Create new term/tag

## REST API Endpoints

The plugin exposes these REST API endpoints (all require authentication):

### Posts
- `GET /wp-json/fc-manager/v1/posts` - List posts
- `GET /wp-json/fc-manager/v1/posts/{id}` - Get post
- `POST /wp-json/fc-manager/v1/posts` - Create post
- `POST /wp-json/fc-manager/v1/posts/{id}` - Update post
- `DELETE /wp-json/fc-manager/v1/posts/{id}` - Delete post

### Spaces
- `GET /wp-json/fc-manager/v1/spaces` - List spaces
- `GET /wp-json/fc-manager/v1/spaces/{id}` - Get space
- `POST /wp-json/fc-manager/v1/spaces` - Create space
- `POST /wp-json/fc-manager/v1/spaces/{id}` - Update space

### Comments
- `GET /wp-json/fc-manager/v1/comments` - List comments
- `POST /wp-json/fc-manager/v1/comments` - Create comment
- `POST /wp-json/fc-manager/v1/comments/{id}` - Update comment
- `DELETE /wp-json/fc-manager/v1/comments/{id}` - Delete comment

### Space Members
- `GET /wp-json/fc-manager/v1/space-members` - List members
- `POST /wp-json/fc-manager/v1/space-members` - Add member
- `DELETE /wp-json/fc-manager/v1/space-members/{id}` - Remove member

### Chat
- `GET /wp-json/fc-manager/v1/chat-threads` - List threads
- `GET /wp-json/fc-manager/v1/chat-messages` - List messages
- `POST /wp-json/fc-manager/v1/chat-messages` - Send message

### Terms
- `GET /wp-json/fc-manager/v1/terms` - List terms
- `POST /wp-json/fc-manager/v1/terms` - Create term

## Authentication

The REST API uses WordPress Application Passwords for authentication:

1. Go to: **WordPress Admin → Users → Your Profile**
2. Scroll to **Application Passwords**
3. Enter a name (e.g., "FluentCommunity MCP")
4. Click **Add New Application Password**
5. Copy the generated password (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. Use this in your `.env` file as `WP_APP_PASSWORD`

## Security

- ✅ All REST API endpoints require authentication
- ✅ Users must have `edit_posts` capability
- ✅ All data is sanitized and validated
- ✅ WordPress nonces protect against CSRF
- ✅ Application Passwords can be revoked anytime

## Comparison with FlowMattic

This plugin provides similar functionality to FlowMattic's MCP integration but with some key differences:

| Feature | FluentCommunity Manager | FlowMattic |
|---------|------------------------|------------|
| **Price** | Free & Open Source | Paid (Lifetime/Annual) |
| **MCP Tools** | 26+ tools | Limited tools |
| **Direct DB Access** | ✅ Yes | ❌ No |
| **Bulk Operations** | ✅ Built-in | Requires workflows |
| **Search** | ✅ Advanced search | Basic |
| **Admin UI** | ✅ Full interface | Limited |
| **Automation** | Via MCP/AI | Via workflows |
| **Setup** | Simple .env config | Workflow builder |

## Troubleshooting

### "Permission denied" errors
- Ensure your WordPress user has `edit_posts` capability
- Verify Application Password is correct
- Check that the plugin is activated

### "Table not found" errors
- Verify FluentCommunity is installed and activated
- Check `WP_DB_PREFIX` and `FC_TABLE_PREFIX` in `.env`
- Default is usually `wp_` and `fcom_`

### MCP Server not connecting
- Restart Claude Desktop after config changes
- Check the path to `index.js` is correct
- Verify Node.js is installed (`node --version`)
- Check `.env` file exists and has correct values

### REST API 404 errors
- Go to **WordPress Admin → Settings → Permalinks**
- Click **Save Changes** to flush rewrite rules
- Verify plugin is activated

## Development

### Running in Development Mode

```bash
npm run dev
```

This will run the MCP server with auto-reload on file changes.

### Testing REST API

You can test the REST API using curl:

```bash
# List posts
curl -u username:app-password https://your-site.com/wp-json/fc-manager/v1/posts

# Create a post
curl -X POST -u username:app-password \
  -H "Content-Type: application/json" \
  -d '{"space_id":1,"user_id":1,"message":"Hello from API!"}' \
  https://your-site.com/wp-json/fc-manager/v1/posts
```

## Changelog

### Version 2.0.0 (2025-01-11)
- ✨ Added complete MCP server integration
- ✨ Added 26+ MCP tools for AI management
- ✨ Added REST API endpoints for all FluentCommunity content
- ✨ Added bulk operations support
- ✨ Added advanced search functionality
- ✨ Added space analytics
- 🔧 Updated to support FluentCommunity latest version
- 📚 Complete documentation and examples

### Version 1.1.1
- Initial release with admin interface
- Basic CRUD operations
- Export to LLM functionality

## Support

- **Issues**: [GitHub Issues](https://github.com/wplaunchify/fluent-community-manager/issues)
- **Documentation**: [GitHub Wiki](https://github.com/wplaunchify/fluent-community-manager/wiki)
- **Website**: [wplaunchify.com](https://wplaunchify.com)

## Credits

- **Author**: 1WD LLC
- **FluentCommunity**: [WPManageNinja](https://fluentcommunity.co)
- **MCP Protocol**: [Anthropic](https://modelcontextprotocol.io)

## License

GPL v2 or later

---

**Made with ❤️ for the FluentCommunity ecosystem**
