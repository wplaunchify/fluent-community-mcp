#!/usr/bin/env node

/**
 * FluentCommunity MCP Server
 * 
 * Model Context Protocol server for managing FluentCommunity WordPress plugin
 * Enables AI assistants to interact with FluentCommunity content via REST API
 * 
 * @version 1.0.0
 * @author 1WD LLC
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const config = {
  wpSiteUrl: process.env.WP_SITE_URL || '',
  wpUsername: process.env.WP_USERNAME || '',
  wpAppPassword: process.env.WP_APP_PASSWORD || '',
  wpJwtToken: process.env.WP_JWT_TOKEN || '',
  wpDbPrefix: process.env.WP_DB_PREFIX || 'wp_',
  fcTablePrefix: process.env.FC_TABLE_PREFIX || 'fcom_',
  serverName: process.env.MCP_SERVER_NAME || 'fluent-community-manager',
  serverVersion: process.env.MCP_SERVER_VERSION || '1.0.0',
};

// Validate configuration
if (!config.wpSiteUrl) {
  console.error('Error: WP_SITE_URL is required in .env file');
  process.exit(1);
}

if (!config.wpUsername || !config.wpAppPassword) {
  if (!config.wpJwtToken) {
    console.error('Error: Either WP_USERNAME/WP_APP_PASSWORD or WP_JWT_TOKEN is required');
    process.exit(1);
  }
}

/**
 * Create authenticated axios instance for WordPress REST API
 */
const createWPClient = () => {
  const headers = {};
  
  if (config.wpJwtToken) {
    headers['Authorization'] = `Bearer ${config.wpJwtToken}`;
  }
  
  const client = axios.create({
    baseURL: `${config.wpSiteUrl}/wp-json`,
    headers,
  });
  
  // Add Basic Auth if using application password
  if (config.wpUsername && config.wpAppPassword) {
    const auth = Buffer.from(`${config.wpUsername}:${config.wpAppPassword}`).toString('base64');
    client.defaults.headers.common['Authorization'] = `Basic ${auth}`;
  }
  
  return client;
};

const wpClient = createWPClient();

/**
 * Helper function to make direct database queries via custom endpoint
 * (Requires the fluent-community-manager plugin to be active)
 */
async function queryFCDatabase(table, params = {}) {
  try {
    const response = await wpClient.get(`/fc-manager/v1/${table}`, { params });
    return response.data;
  } catch (error) {
    throw new Error(`Database query failed: ${error.message}`);
  }
}

/**
 * Helper function to update FC database records
 */
async function updateFCDatabase(table, id, data) {
  try {
    const response = await wpClient.post(`/fc-manager/v1/${table}/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }
}

/**
 * Helper function to create FC database records
 */
async function createFCDatabase(table, data) {
  try {
    const response = await wpClient.post(`/fc-manager/v1/${table}`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Database create failed: ${error.message}`);
  }
}

/**
 * Helper function to delete FC database records
 */
async function deleteFCDatabase(table, id) {
  try {
    const response = await wpClient.delete(`/fc-manager/v1/${table}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Database delete failed: ${error.message}`);
  }
}

// Initialize MCP Server
const server = new Server(
  {
    name: config.serverName,
    version: config.serverVersion,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Tool Definitions
 */
const tools = [
  // ==================== POSTS TOOLS ====================
  {
    name: 'fc_list_posts',
    description: 'List all posts from FluentCommunity with optional filtering',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'Filter posts by space ID',
        },
        user_id: {
          type: 'number',
          description: 'Filter posts by user ID',
        },
        status: {
          type: 'string',
          description: 'Filter by status (published, draft, etc.)',
          enum: ['published', 'draft', 'pending', 'archived'],
        },
        type: {
          type: 'string',
          description: 'Filter by post type (text, video, etc.)',
        },
        limit: {
          type: 'number',
          description: 'Number of posts to return (default: 20)',
          default: 20,
        },
        offset: {
          type: 'number',
          description: 'Offset for pagination (default: 0)',
          default: 0,
        },
        search: {
          type: 'string',
          description: 'Search term to filter posts',
        },
      },
    },
  },
  {
    name: 'fc_get_post',
    description: 'Get a specific post by ID with all details',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'The ID of the post to retrieve',
        },
      },
      required: ['post_id'],
    },
  },
  {
    name: 'fc_create_post',
    description: 'Create a new post in FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The space ID where the post will be created',
        },
        user_id: {
          type: 'number',
          description: 'The user ID who creates the post',
        },
        title: {
          type: 'string',
          description: 'Post title',
        },
        message: {
          type: 'string',
          description: 'Post content/message',
        },
        message_rendered: {
          type: 'string',
          description: 'Rendered HTML version of the message',
        },
        type: {
          type: 'string',
          description: 'Post type (text, video, etc.)',
          default: 'text',
        },
        status: {
          type: 'string',
          description: 'Post status',
          enum: ['published', 'draft', 'pending'],
          default: 'published',
        },
        privacy: {
          type: 'string',
          description: 'Post privacy setting',
          enum: ['public', 'private', 'friends'],
          default: 'public',
        },
        featured_image: {
          type: 'string',
          description: 'URL of the featured image',
        },
        meta: {
          type: 'object',
          description: 'Additional metadata as JSON object',
        },
      },
      required: ['space_id', 'user_id', 'message'],
    },
  },
  {
    name: 'fc_update_post',
    description: 'Update an existing post in FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'The ID of the post to update',
        },
        title: {
          type: 'string',
          description: 'Post title',
        },
        message: {
          type: 'string',
          description: 'Post content/message',
        },
        message_rendered: {
          type: 'string',
          description: 'Rendered HTML version of the message',
        },
        type: {
          type: 'string',
          description: 'Post type',
        },
        status: {
          type: 'string',
          description: 'Post status',
          enum: ['published', 'draft', 'pending', 'archived'],
        },
        privacy: {
          type: 'string',
          description: 'Post privacy setting',
          enum: ['public', 'private', 'friends'],
        },
        featured_image: {
          type: 'string',
          description: 'URL of the featured image',
        },
        meta: {
          type: 'object',
          description: 'Additional metadata as JSON object',
        },
      },
      required: ['post_id'],
    },
  },
  {
    name: 'fc_delete_post',
    description: 'Delete a post from FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'The ID of the post to delete',
        },
      },
      required: ['post_id'],
    },
  },
  
  // ==================== SPACES TOOLS ====================
  {
    name: 'fc_list_spaces',
    description: 'List all spaces in FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'Filter by status',
          enum: ['active', 'inactive', 'archived'],
        },
        type: {
          type: 'string',
          description: 'Filter by space type',
        },
        privacy: {
          type: 'string',
          description: 'Filter by privacy setting',
          enum: ['public', 'private'],
        },
        limit: {
          type: 'number',
          description: 'Number of spaces to return',
          default: 20,
        },
        search: {
          type: 'string',
          description: 'Search term',
        },
      },
    },
  },
  {
    name: 'fc_get_space',
    description: 'Get detailed information about a specific space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The ID of the space to retrieve',
        },
      },
      required: ['space_id'],
    },
  },
  {
    name: 'fc_create_space',
    description: 'Create a new space in FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Space title',
        },
        slug: {
          type: 'string',
          description: 'Space slug (URL-friendly name)',
        },
        description: {
          type: 'string',
          description: 'Space description',
        },
        type: {
          type: 'string',
          description: 'Space type',
        },
        privacy: {
          type: 'string',
          description: 'Privacy setting',
          enum: ['public', 'private'],
          default: 'public',
        },
        status: {
          type: 'string',
          description: 'Space status',
          enum: ['active', 'inactive'],
          default: 'active',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'fc_update_space',
    description: 'Update an existing space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The ID of the space to update',
        },
        title: {
          type: 'string',
          description: 'Space title',
        },
        description: {
          type: 'string',
          description: 'Space description',
        },
        privacy: {
          type: 'string',
          description: 'Privacy setting',
          enum: ['public', 'private'],
        },
        status: {
          type: 'string',
          description: 'Space status',
          enum: ['active', 'inactive', 'archived'],
        },
      },
      required: ['space_id'],
    },
  },
  
  // ==================== COMMENTS TOOLS ====================
  {
    name: 'fc_list_comments',
    description: 'List comments for a specific post or all comments',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'Filter comments by post ID',
        },
        user_id: {
          type: 'number',
          description: 'Filter comments by user ID',
        },
        status: {
          type: 'string',
          description: 'Filter by status',
        },
        limit: {
          type: 'number',
          description: 'Number of comments to return',
          default: 50,
        },
      },
    },
  },
  {
    name: 'fc_create_comment',
    description: 'Create a new comment on a post',
    inputSchema: {
      type: 'object',
      properties: {
        post_id: {
          type: 'number',
          description: 'The post ID to comment on',
        },
        user_id: {
          type: 'number',
          description: 'The user ID creating the comment',
        },
        message: {
          type: 'string',
          description: 'Comment message',
        },
        parent_id: {
          type: 'number',
          description: 'Parent comment ID for replies',
        },
      },
      required: ['post_id', 'user_id', 'message'],
    },
  },
  {
    name: 'fc_update_comment',
    description: 'Update an existing comment',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: {
          type: 'number',
          description: 'The ID of the comment to update',
        },
        message: {
          type: 'string',
          description: 'Updated comment message',
        },
        status: {
          type: 'string',
          description: 'Comment status',
        },
      },
      required: ['comment_id'],
    },
  },
  {
    name: 'fc_delete_comment',
    description: 'Delete a comment',
    inputSchema: {
      type: 'object',
      properties: {
        comment_id: {
          type: 'number',
          description: 'The ID of the comment to delete',
        },
      },
      required: ['comment_id'],
    },
  },
  
  // ==================== SPACE MEMBERS TOOLS ====================
  {
    name: 'fc_list_space_members',
    description: 'List members of a specific space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The space ID to list members from',
        },
        status: {
          type: 'string',
          description: 'Filter by member status',
          enum: ['active', 'pending', 'banned'],
        },
        limit: {
          type: 'number',
          description: 'Number of members to return',
          default: 50,
        },
      },
      required: ['space_id'],
    },
  },
  {
    name: 'fc_add_space_member',
    description: 'Add a user to a space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The space ID',
        },
        user_id: {
          type: 'number',
          description: 'The user ID to add',
        },
        role: {
          type: 'string',
          description: 'Member role in the space',
          default: 'member',
        },
      },
      required: ['space_id', 'user_id'],
    },
  },
  {
    name: 'fc_remove_space_member',
    description: 'Remove a user from a space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The space ID',
        },
        user_id: {
          type: 'number',
          description: 'The user ID to remove',
        },
      },
      required: ['space_id', 'user_id'],
    },
  },
  
  // ==================== CHAT TOOLS ====================
  {
    name: 'fc_list_chat_threads',
    description: 'List chat threads/conversations',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: {
          type: 'number',
          description: 'Filter threads by user ID',
        },
        status: {
          type: 'string',
          description: 'Filter by thread status',
        },
        limit: {
          type: 'number',
          description: 'Number of threads to return',
          default: 20,
        },
      },
    },
  },
  {
    name: 'fc_list_chat_messages',
    description: 'List messages in a chat thread',
    inputSchema: {
      type: 'object',
      properties: {
        thread_id: {
          type: 'number',
          description: 'The thread ID to get messages from',
        },
        limit: {
          type: 'number',
          description: 'Number of messages to return',
          default: 50,
        },
      },
      required: ['thread_id'],
    },
  },
  {
    name: 'fc_send_chat_message',
    description: 'Send a message in a chat thread',
    inputSchema: {
      type: 'object',
      properties: {
        thread_id: {
          type: 'number',
          description: 'The thread ID',
        },
        user_id: {
          type: 'number',
          description: 'The user ID sending the message',
        },
        message: {
          type: 'string',
          description: 'Message content',
        },
      },
      required: ['thread_id', 'user_id', 'message'],
    },
  },
  
  // ==================== SEARCH & ANALYTICS TOOLS ====================
  {
    name: 'fc_search_content',
    description: 'Search across all FluentCommunity content (posts, comments, spaces)',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        content_type: {
          type: 'string',
          description: 'Type of content to search',
          enum: ['all', 'posts', 'comments', 'spaces', 'users'],
          default: 'all',
        },
        space_id: {
          type: 'number',
          description: 'Limit search to specific space',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return',
          default: 20,
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'fc_get_space_analytics',
    description: 'Get analytics and statistics for a space',
    inputSchema: {
      type: 'object',
      properties: {
        space_id: {
          type: 'number',
          description: 'The space ID to get analytics for',
        },
        date_from: {
          type: 'string',
          description: 'Start date (YYYY-MM-DD)',
        },
        date_to: {
          type: 'string',
          description: 'End date (YYYY-MM-DD)',
        },
      },
      required: ['space_id'],
    },
  },
  
  // ==================== BULK OPERATIONS ====================
  {
    name: 'fc_bulk_create_posts',
    description: 'Create multiple posts at once (useful for AI-generated content campaigns)',
    inputSchema: {
      type: 'object',
      properties: {
        posts: {
          type: 'array',
          description: 'Array of post objects to create',
          items: {
            type: 'object',
            properties: {
              space_id: { type: 'number' },
              user_id: { type: 'number' },
              title: { type: 'string' },
              message: { type: 'string' },
              type: { type: 'string' },
              status: { type: 'string' },
              scheduled_at: { type: 'string', description: 'Schedule time (YYYY-MM-DD HH:MM:SS)' },
            },
            required: ['space_id', 'user_id', 'message'],
          },
        },
      },
      required: ['posts'],
    },
  },
  {
    name: 'fc_bulk_update_posts',
    description: 'Update multiple posts at once',
    inputSchema: {
      type: 'object',
      properties: {
        post_ids: {
          type: 'array',
          description: 'Array of post IDs to update',
          items: { type: 'number' },
        },
        updates: {
          type: 'object',
          description: 'Fields to update on all posts',
          properties: {
            status: { type: 'string' },
            privacy: { type: 'string' },
            type: { type: 'string' },
          },
        },
      },
      required: ['post_ids', 'updates'],
    },
  },
  {
    name: 'fc_bulk_delete_posts',
    description: 'Delete multiple posts at once',
    inputSchema: {
      type: 'object',
      properties: {
        post_ids: {
          type: 'array',
          description: 'Array of post IDs to delete',
          items: { type: 'number' },
        },
      },
      required: ['post_ids'],
    },
  },
  
  // ==================== TERMS/TAGS TOOLS ====================
  {
    name: 'fc_list_terms',
    description: 'List all terms/tags in FluentCommunity',
    inputSchema: {
      type: 'object',
      properties: {
        taxonomy: {
          type: 'string',
          description: 'Filter by taxonomy type',
        },
        limit: {
          type: 'number',
          description: 'Number of terms to return',
          default: 50,
        },
      },
    },
  },
  {
    name: 'fc_create_term',
    description: 'Create a new term/tag',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Term title',
        },
        slug: {
          type: 'string',
          description: 'Term slug',
        },
        description: {
          type: 'string',
          description: 'Term description',
        },
      },
      required: ['title'],
    },
  },
];

/**
 * Register tool handlers
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // ==================== POSTS HANDLERS ====================
      case 'fc_list_posts': {
        const table = `${config.fcTablePrefix}posts`;
        const params = {
          limit: args.limit || 20,
          offset: args.offset || 0,
        };
        
        if (args.space_id) params.space_id = args.space_id;
        if (args.user_id) params.user_id = args.user_id;
        if (args.status) params.status = args.status;
        if (args.type) params.type = args.type;
        if (args.search) params.search = args.search;
        
        const posts = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(posts, null, 2),
            },
          ],
        };
      }

      case 'fc_get_post': {
        const table = `${config.fcTablePrefix}posts`;
        const post = await queryFCDatabase(`${table}/${args.post_id}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(post, null, 2),
            },
          ],
        };
      }

      case 'fc_create_post': {
        const table = `${config.fcTablePrefix}posts`;
        const postData = {
          space_id: args.space_id,
          user_id: args.user_id,
          message: args.message,
          type: args.type || 'text',
          status: args.status || 'published',
          privacy: args.privacy || 'public',
        };
        
        if (args.title) postData.title = args.title;
        if (args.message_rendered) postData.message_rendered = args.message_rendered;
        if (args.featured_image) postData.featured_image = args.featured_image;
        if (args.meta) postData.meta = JSON.stringify(args.meta);
        
        const result = await createFCDatabase(table, postData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Post created successfully! ID: ${result.id}\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_update_post': {
        const table = `${config.fcTablePrefix}posts`;
        const updateData = {};
        
        if (args.title) updateData.title = args.title;
        if (args.message) updateData.message = args.message;
        if (args.message_rendered) updateData.message_rendered = args.message_rendered;
        if (args.type) updateData.type = args.type;
        if (args.status) updateData.status = args.status;
        if (args.privacy) updateData.privacy = args.privacy;
        if (args.featured_image) updateData.featured_image = args.featured_image;
        if (args.meta) updateData.meta = JSON.stringify(args.meta);
        
        const result = await updateFCDatabase(table, args.post_id, updateData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Post updated successfully!\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_delete_post': {
        const table = `${config.fcTablePrefix}posts`;
        await deleteFCDatabase(table, args.post_id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Post ${args.post_id} deleted successfully!`,
            },
          ],
        };
      }

      // ==================== SPACES HANDLERS ====================
      case 'fc_list_spaces': {
        const table = `${config.fcTablePrefix}spaces`;
        const params = { limit: args.limit || 20 };
        
        if (args.status) params.status = args.status;
        if (args.type) params.type = args.type;
        if (args.privacy) params.privacy = args.privacy;
        if (args.search) params.search = args.search;
        
        const spaces = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(spaces, null, 2),
            },
          ],
        };
      }

      case 'fc_get_space': {
        const table = `${config.fcTablePrefix}spaces`;
        const space = await queryFCDatabase(`${table}/${args.space_id}`);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(space, null, 2),
            },
          ],
        };
      }

      case 'fc_create_space': {
        const table = `${config.fcTablePrefix}spaces`;
        const spaceData = {
          title: args.title,
          slug: args.slug || args.title.toLowerCase().replace(/\s+/g, '-'),
          privacy: args.privacy || 'public',
          status: args.status || 'active',
        };
        
        if (args.description) spaceData.description = args.description;
        if (args.type) spaceData.type = args.type;
        
        const result = await createFCDatabase(table, spaceData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Space created successfully! ID: ${result.id}\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_update_space': {
        const table = `${config.fcTablePrefix}spaces`;
        const updateData = {};
        
        if (args.title) updateData.title = args.title;
        if (args.description) updateData.description = args.description;
        if (args.privacy) updateData.privacy = args.privacy;
        if (args.status) updateData.status = args.status;
        
        const result = await updateFCDatabase(table, args.space_id, updateData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Space updated successfully!\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      // ==================== COMMENTS HANDLERS ====================
      case 'fc_list_comments': {
        const table = `${config.fcTablePrefix}post_comments`;
        const params = { limit: args.limit || 50 };
        
        if (args.post_id) params.post_id = args.post_id;
        if (args.user_id) params.user_id = args.user_id;
        if (args.status) params.status = args.status;
        
        const comments = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(comments, null, 2),
            },
          ],
        };
      }

      case 'fc_create_comment': {
        const table = `${config.fcTablePrefix}post_comments`;
        const commentData = {
          post_id: args.post_id,
          user_id: args.user_id,
          message: args.message,
        };
        
        if (args.parent_id) commentData.parent_id = args.parent_id;
        
        const result = await createFCDatabase(table, commentData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Comment created successfully! ID: ${result.id}\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_update_comment': {
        const table = `${config.fcTablePrefix}post_comments`;
        const updateData = {};
        
        if (args.message) updateData.message = args.message;
        if (args.status) updateData.status = args.status;
        
        const result = await updateFCDatabase(table, args.comment_id, updateData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Comment updated successfully!\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_delete_comment': {
        const table = `${config.fcTablePrefix}post_comments`;
        await deleteFCDatabase(table, args.comment_id);
        
        return {
          content: [
            {
              type: 'text',
              text: `Comment ${args.comment_id} deleted successfully!`,
            },
          ],
        };
      }

      // ==================== SPACE MEMBERS HANDLERS ====================
      case 'fc_list_space_members': {
        const table = `${config.fcTablePrefix}space_user`;
        const params = {
          space_id: args.space_id,
          limit: args.limit || 50,
        };
        
        if (args.status) params.status = args.status;
        
        const members = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(members, null, 2),
            },
          ],
        };
      }

      case 'fc_add_space_member': {
        const table = `${config.fcTablePrefix}space_user`;
        const memberData = {
          space_id: args.space_id,
          user_id: args.user_id,
          role: args.role || 'member',
          status: 'active',
        };
        
        const result = await createFCDatabase(table, memberData);
        
        return {
          content: [
            {
              type: 'text',
              text: `User ${args.user_id} added to space ${args.space_id} successfully!\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_remove_space_member': {
        const table = `${config.fcTablePrefix}space_user`;
        // Find the member record first
        const members = await queryFCDatabase(table, {
          space_id: args.space_id,
          user_id: args.user_id,
        });
        
        if (members && members.length > 0) {
          await deleteFCDatabase(table, members[0].id);
          return {
            content: [
              {
                type: 'text',
                text: `User ${args.user_id} removed from space ${args.space_id} successfully!`,
              },
            ],
          };
        } else {
          throw new Error('Member not found in space');
        }
      }

      // ==================== CHAT HANDLERS ====================
      case 'fc_list_chat_threads': {
        const table = `${config.fcTablePrefix}chat_threads`;
        const params = { limit: args.limit || 20 };
        
        if (args.user_id) params.user_id = args.user_id;
        if (args.status) params.status = args.status;
        
        const threads = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(threads, null, 2),
            },
          ],
        };
      }

      case 'fc_list_chat_messages': {
        const table = `${config.fcTablePrefix}chat_messages`;
        const params = {
          thread_id: args.thread_id,
          limit: args.limit || 50,
        };
        
        const messages = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(messages, null, 2),
            },
          ],
        };
      }

      case 'fc_send_chat_message': {
        const table = `${config.fcTablePrefix}chat_messages`;
        const messageData = {
          thread_id: args.thread_id,
          user_id: args.user_id,
          message: args.message,
        };
        
        const result = await createFCDatabase(table, messageData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Message sent successfully! ID: ${result.id}\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      // ==================== SEARCH & ANALYTICS HANDLERS ====================
      case 'fc_search_content': {
        const contentType = args.content_type || 'all';
        const tables = {
          posts: `${config.fcTablePrefix}posts`,
          comments: `${config.fcTablePrefix}post_comments`,
          spaces: `${config.fcTablePrefix}spaces`,
        };
        
        const results = {};
        const searchTables = contentType === 'all' ? Object.keys(tables) : [contentType];
        
        for (const type of searchTables) {
          if (tables[type]) {
            const params = {
              search: args.query,
              limit: args.limit || 20,
            };
            
            if (args.space_id && type === 'posts') {
              params.space_id = args.space_id;
            }
            
            results[type] = await queryFCDatabase(tables[type], params);
          }
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results, null, 2),
            },
          ],
        };
      }

      case 'fc_get_space_analytics': {
        const postsTable = `${config.fcTablePrefix}posts`;
        const membersTable = `${config.fcTablePrefix}space_user`;
        const commentsTable = `${config.fcTablePrefix}post_comments`;
        
        // Get post count
        const posts = await queryFCDatabase(postsTable, { space_id: args.space_id });
        
        // Get member count
        const members = await queryFCDatabase(membersTable, { space_id: args.space_id });
        
        // Get comment count for space posts
        let totalComments = 0;
        if (posts && posts.length > 0) {
          for (const post of posts) {
            const comments = await queryFCDatabase(commentsTable, { post_id: post.id });
            totalComments += comments ? comments.length : 0;
          }
        }
        
        const analytics = {
          space_id: args.space_id,
          total_posts: posts ? posts.length : 0,
          total_members: members ? members.length : 0,
          total_comments: totalComments,
          date_from: args.date_from || 'all time',
          date_to: args.date_to || 'now',
        };
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(analytics, null, 2),
            },
          ],
        };
      }

      // ==================== BULK OPERATIONS HANDLERS ====================
      case 'fc_bulk_create_posts': {
        const table = `${config.fcTablePrefix}posts`;
        const results = [];
        
        for (const postData of args.posts) {
          const data = {
            space_id: postData.space_id,
            user_id: postData.user_id,
            message: postData.message,
            type: postData.type || 'text',
            status: postData.status || 'published',
          };
          
          if (postData.title) data.title = postData.title;
          if (postData.scheduled_at) data.scheduled_at = postData.scheduled_at;
          
          const result = await createFCDatabase(table, data);
          results.push(result);
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully created ${results.length} posts!\n\n${JSON.stringify(results, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_bulk_update_posts': {
        const table = `${config.fcTablePrefix}posts`;
        const results = [];
        
        for (const postId of args.post_ids) {
          const result = await updateFCDatabase(table, postId, args.updates);
          results.push(result);
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully updated ${results.length} posts!\n\n${JSON.stringify(results, null, 2)}`,
            },
          ],
        };
      }

      case 'fc_bulk_delete_posts': {
        const table = `${config.fcTablePrefix}posts`;
        
        for (const postId of args.post_ids) {
          await deleteFCDatabase(table, postId);
        }
        
        return {
          content: [
            {
              type: 'text',
              text: `Successfully deleted ${args.post_ids.length} posts!`,
            },
          ],
        };
      }

      // ==================== TERMS HANDLERS ====================
      case 'fc_list_terms': {
        const table = `${config.fcTablePrefix}terms`;
        const params = { limit: args.limit || 50 };
        
        if (args.taxonomy) params.taxonomy = args.taxonomy;
        
        const terms = await queryFCDatabase(table, params);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(terms, null, 2),
            },
          ],
        };
      }

      case 'fc_create_term': {
        const table = `${config.fcTablePrefix}terms`;
        const termData = {
          title: args.title,
          slug: args.slug || args.title.toLowerCase().replace(/\s+/g, '-'),
        };
        
        if (args.description) termData.description = args.description;
        
        const result = await createFCDatabase(table, termData);
        
        return {
          content: [
            {
              type: 'text',
              text: `Term created successfully! ID: ${result.id}\n\n${JSON.stringify(result, null, 2)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('FluentCommunity MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
