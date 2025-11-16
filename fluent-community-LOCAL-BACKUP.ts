/**
 * FluentCommunity-specific tools
 * These tools interact with the custom /fc-manager/v1/ REST API endpoints
 * provided by the fluent-community-manager WordPress plugin
 */

import { z } from 'zod';
import { WordPressClient } from '../wordpress.js';

/**
 * Register all FluentCommunity tools
 */
export function registerFluentCommunityTools(wordpress: WordPressClient) {
  return [
    // ==================== SPACES ====================
    {
      name: 'fc_list_spaces',
      description: 'List all FluentCommunity spaces with filtering and pagination',
      inputSchema: z.object({
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 20)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
        search: z.string().optional().describe('Search term for space title'),
        status: z.enum(['active', 'inactive', 'archived']).optional().describe('Filter by status'),
        privacy: z.enum(['public', 'private']).optional().describe('Filter by privacy setting'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());
        if (args.search) params.append('search', args.search);
        if (args.status) params.append('status', args.status);
        if (args.privacy) params.append('privacy', args.privacy);

        const response = await wordpress.get(`/fc-manager/v1/spaces?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_get_space',
      description: 'Get detailed information about a specific FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.get(`/fc-manager/v1/spaces/${args.space_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_create_space',
      description: 'Create a new FluentCommunity space',
      inputSchema: z.object({
        title: z.string().describe('Space title'),
        slug: z.string().optional().describe('Space slug (URL-friendly name)'),
        description: z.string().optional().describe('Space description'),
        privacy: z.enum(['public', 'private']).optional().describe('Privacy setting (default: public)'),
        status: z.enum(['active', 'inactive']).optional().describe('Space status (default: active)'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.post('/fc-manager/v1/spaces', args);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_update_space',
      description: 'Update an existing FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID to update'),
        title: z.string().optional().describe('Space title'),
        description: z.string().optional().describe('Space description'),
        privacy: z.enum(['public', 'private']).optional().describe('Privacy setting'),
        status: z.enum(['active', 'inactive', 'archived']).optional().describe('Space status'),
      }),
      handler: async (args: any) => {
        const { space_id, ...data } = args;
        const response = await wordpress.put(`/fc-manager/v1/spaces/${space_id}`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_delete_space',
      description: 'Delete a FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID to delete'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.delete(`/fc-manager/v1/spaces/${args.space_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== POSTS ====================
    {
      name: 'fc_list_posts',
      description: 'List FluentCommunity posts with filtering and pagination',
      inputSchema: z.object({
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 20)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
        space_id: z.number().optional().describe('Filter by space ID'),
        user_id: z.number().optional().describe('Filter by user ID'),
        search: z.string().optional().describe('Search term'),
        status: z.enum(['published', 'draft', 'pending', 'archived']).optional().describe('Filter by status'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());
        if (args.space_id) params.append('space_id', args.space_id.toString());
        if (args.user_id) params.append('user_id', args.user_id.toString());
        if (args.search) params.append('search', args.search);
        if (args.status) params.append('status', args.status);

        const response = await wordpress.get(`/fc-manager/v1/posts?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_get_post',
      description: 'Get a specific FluentCommunity post by ID',
      inputSchema: z.object({
        post_id: z.number().describe('The post ID'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.get(`/fc-manager/v1/posts/${args.post_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_create_post',
      description: 'Create a new FluentCommunity post with full HTML5 support. Use bypass_sanitization for rich HTML content including videos, styled layouts, and embedded iframes. Use message_base64 for large HTML content to avoid JSON encoding issues.',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID where the post will be created'),
        user_id: z.number().describe('The user ID who creates the post'),
        title: z.string().optional().describe('Post title'),
        message: z.string().optional().describe('Post content/message (supports full HTML when bypass_sanitization is true)'),
        message_base64: z.string().optional().describe('Base64-encoded message for large HTML content (bypasses JSON encoding limits)'),
        bypass_sanitization: z.boolean().optional().describe('Set to true to allow ANY HTML without WordPress filtering (required for videos, iframes, complex styling)'),
        type: z.string().optional().describe('Post type (default: text)'),
        status: z.enum(['published', 'draft', 'pending']).optional().describe('Post status (default: published)'),
        privacy: z.enum(['public', 'private', 'friends']).optional().describe('Post privacy (default: public)'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.post('/fc-manager/v1/posts', args);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_update_post',
      description: 'Update an existing FluentCommunity post',
      inputSchema: z.object({
        post_id: z.number().describe('The post ID to update'),
        title: z.string().optional().describe('Post title'),
        message: z.string().optional().describe('Post content/message'),
        status: z.enum(['published', 'draft', 'pending', 'archived']).optional().describe('Post status'),
        privacy: z.enum(['public', 'private', 'friends']).optional().describe('Post privacy'),
      }),
      handler: async (args: any) => {
        const { post_id, ...data } = args;
        const response = await wordpress.put(`/fc-manager/v1/posts/${post_id}`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_delete_post',
      description: 'Delete a FluentCommunity post',
      inputSchema: z.object({
        post_id: z.number().describe('The post ID to delete'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.delete(`/fc-manager/v1/posts/${args.post_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== COMMENTS ====================
    {
      name: 'fc_list_comments',
      description: 'List FluentCommunity comments with filtering',
      inputSchema: z.object({
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 50)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
        post_id: z.number().optional().describe('Filter by post ID'),
        user_id: z.number().optional().describe('Filter by user ID'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());
        if (args.post_id) params.append('post_id', args.post_id.toString());
        if (args.user_id) params.append('user_id', args.user_id.toString());

        const response = await wordpress.get(`/fc-manager/v1/comments?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_get_comment',
      description: 'Get a specific FluentCommunity comment by ID',
      inputSchema: z.object({
        comment_id: z.number().describe('The comment ID'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.get(`/fc-manager/v1/comments/${args.comment_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_create_comment',
      description: 'Create a new comment on a FluentCommunity post',
      inputSchema: z.object({
        post_id: z.number().describe('The post ID to comment on'),
        user_id: z.number().describe('The user ID creating the comment'),
        message: z.string().describe('Comment message'),
        parent_id: z.number().optional().describe('Parent comment ID for replies'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.post('/fc-manager/v1/comments', args);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_update_comment',
      description: 'Update an existing FluentCommunity comment',
      inputSchema: z.object({
        comment_id: z.number().describe('The comment ID to update'),
        message: z.string().optional().describe('Updated comment message'),
      }),
      handler: async (args: any) => {
        const { comment_id, ...data } = args;
        const response = await wordpress.put(`/fc-manager/v1/comments/${comment_id}`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_delete_comment',
      description: 'Delete a FluentCommunity comment',
      inputSchema: z.object({
        comment_id: z.number().describe('The comment ID to delete'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.delete(`/fc-manager/v1/comments/${args.comment_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== SPACE MEMBERS ====================
    {
      name: 'fc_list_space_members',
      description: 'List members of a specific FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID'),
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 50)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());

        const response = await wordpress.get(`/fc-manager/v1/spaces/${args.space_id}/members?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_add_space_member',
      description: 'Add a user to a FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID'),
        user_id: z.number().describe('The user ID to add'),
        role: z.string().optional().describe('Member role in the space (default: member)'),
      }),
      handler: async (args: any) => {
        const { space_id, ...data } = args;
        const response = await wordpress.post(`/fc-manager/v1/spaces/${space_id}/members`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_remove_space_member',
      description: 'Remove a user from a FluentCommunity space',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID'),
        user_id: z.number().describe('The user ID to remove'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.delete(`/fc-manager/v1/spaces/${args.space_id}/members/${args.user_id}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_update_space_member',
      description: 'Update a space member role or settings',
      inputSchema: z.object({
        space_id: z.number().describe('The space ID'),
        user_id: z.number().describe('The user ID'),
        role: z.string().optional().describe('New member role'),
      }),
      handler: async (args: any) => {
        const { space_id, user_id, ...data } = args;
        const response = await wordpress.put(`/fc-manager/v1/spaces/${space_id}/members/${user_id}`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== SEARCH ====================
    {
      name: 'fc_search_content',
      description: 'Search across all FluentCommunity content (posts, comments, spaces)',
      inputSchema: z.object({
        query: z.string().describe('Search query'),
        space_id: z.number().optional().describe('Limit search to specific space'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        params.append('query', args.query);
        if (args.space_id) params.append('space_id', args.space_id.toString());

        const response = await wordpress.get(`/fc-manager/v1/search?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== CHAT ====================
    {
      name: 'fc_list_chat_threads',
      description: 'List FluentCommunity chat threads',
      inputSchema: z.object({
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 20)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());

        const response = await wordpress.get(`/fc-manager/v1/chat/threads?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_list_chat_messages',
      description: 'List messages in a FluentCommunity chat thread',
      inputSchema: z.object({
        thread_id: z.number().describe('The thread ID'),
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 50)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());

        const response = await wordpress.get(`/fc-manager/v1/chat/threads/${args.thread_id}/messages?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_create_chat_message',
      description: 'Send a message in a FluentCommunity chat thread',
      inputSchema: z.object({
        thread_id: z.number().describe('The thread ID'),
        user_id: z.number().describe('The user ID sending the message'),
        message: z.string().describe('Message content'),
      }),
      handler: async (args: any) => {
        const { thread_id, ...data } = args;
        const response = await wordpress.post(`/fc-manager/v1/chat/threads/${thread_id}/messages`, data);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    // ==================== TERMS ====================
    {
      name: 'fc_list_terms',
      description: 'List FluentCommunity terms/tags',
      inputSchema: z.object({
        per_page: z.number().min(1).max(100).optional().describe('Items per page (default: 50)'),
        page: z.number().min(1).optional().describe('Page number (default: 1)'),
      }),
      handler: async (args: any) => {
        const params = new URLSearchParams();
        if (args.per_page) params.append('per_page', args.per_page.toString());
        if (args.page) params.append('page', args.page.toString());

        const response = await wordpress.get(`/fc-manager/v1/terms?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },

    {
      name: 'fc_create_term',
      description: 'Create a new FluentCommunity term/tag',
      inputSchema: z.object({
        title: z.string().describe('Term title'),
        slug: z.string().optional().describe('Term slug'),
        description: z.string().optional().describe('Term description'),
      }),
      handler: async (args: any) => {
        const response = await wordpress.post('/fc-manager/v1/terms', args);
        return { content: [{ type: 'text', text: JSON.stringify(response.data, null, 2) }] };
      },
    },
  ];
}

