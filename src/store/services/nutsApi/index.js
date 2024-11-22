import { makeFormData, sanitize } from '@/helpers';

export const nutsApiEndpoints = (builder) => ({
  getNuts: builder.query({
    providesTags: ['Nuts'],
    query: ({ stageId, ...params }) => {
      return {
        url: `/api/nuts`,
        params: {
          ...params,
          include: 'contact,stage',
          stageId,
        },
      };
    },
  }),
  getHotNuts: builder.query({
    providesTags: ['HotNuts'],
    query: ({ assignedUserId, ...params }) => {
      return {
        url: `/api/users/${assignedUserId}/assigned-nuts`,
        params: {
          ...params,
          include: 'contact,stage',
        },
      };
    },
  }),
  getNutById: builder.query({
    providesTags: ['NutByID'],
    query: (params) => {
      const { id } = params;

      return {
        method: 'GET',
        url: `/api/nut/${id}`,
        params: params,
      };
    },
  }),
  createNut: builder.mutation({
    invalidatesTags: ['Nuts', 'OrganizationPipelinesAndStages'],
    transformResponse: (response) => response ?? {},
    query: ({ name, contactId, stageId, leadSource, assignedUserId, notes }) => {
      return {
        method: 'POST',
        url: `/api/nuts`,
        body: {
          name,
          contactId,
          stageId,
          leadSource,
          assignedUserId,
          notes,
        },
      };
    },
  }),
  updateNut: builder.mutation({
    invalidatesTags: ['Nuts', 'NutByID', 'OrganizationPipelinesAndStages'],
    transformResponse: (response) => response ?? {},
    query: ({ id, name, stageId, leadSource, assignedUserId, contactId }) => {
      return {
        method: 'PUT',
        url: `/api/nut/${id}`,
        body: {
          name,
          stageId,
          leadSource,
          assignedUserId,
          contactId,
        },
      };
    },
  }),
  deleteNut: builder.mutation({
    invalidatesTags: ['Nuts', 'NutByID', 'OrganizationPipelinesAndStages'],
    transformResponse: (response) => response ?? {},
    query: ({ id }) => {
      return {
        url: `/api/nut/${id}`,
        method: 'DELETE',
      };
    },
  }),
  bulkDeleteNuts: builder.mutation({
    invalidatesTags: ['Nuts', 'NutByID', 'OrganizationPipelinesAndStages'],
    transformResponse: (response) => response ?? {},
    query: ({ ids }) => {
      return {
        method: 'POST',
        url: `/api/nuts/delete`,
        body: {
          ids,
        },
      };
    },
  }),
  importNuts: builder.mutation({
    invalidatesTags: ['Nuts', 'NutByID', 'OrganizationPipelinesAndStages'],
    query: (body) => {
      return {
        url: `/api/nuts/import`,
        method: 'POST',
        body,
      };
    },
  }),
  getNotes: builder.query({
    providesTags: ['Notes'],
    query: ({ nutId }) => {
      return {
        url: `/api/nuts/${nutId}/notes`,
      };
    },
  }),
  createNote: builder.mutation({
    invalidatesTags: ['Notes'],
    query: ({ nutId, content }) => {
      return {
        url: `/api/nuts/${nutId}/notes`,
        method: 'POST',
        body: {
          nutId,
          content,
        },
      };
    },
  }),
  updateNote: builder.mutation({
    invalidatesTags: ['Notes'],
    query: ({ noteId, content }) => {
      return {
        url: `/api/nuts/notes/${noteId}`,
        method: 'PUT',
        body: {
          content,
        },
      };
    },
  }),
  deleteNote: builder.mutation({
    invalidatesTags: ['Notes'],
    query: ({ noteId }) => {
      return {
        url: `/api/nuts/notes/${noteId}`,
        method: 'DELETE',
      };
    },
  }),
  getNutFiles: builder.query({
    providesTags: ['NutFiles'],
    query: (params) => {
      const { id } = params;

      return {
        method: 'GET',
        url: `/api/nut/files`,
        params: params,
      };
    },
  }),
  deleteNutFile: builder.mutation({
    invalidatesTags: ['NutFiles', 'NutByID'],
    query: (params) => {
      const { id } = params;

      return {
        method: 'DELETE',
        url: `/api/nut/files/${id}`,
        params: params,
      };
    },
  }),
  attachFileToNut: builder.mutation({
    invalidatesTags: ['NutFiles', 'NutByID'],
    transformResponse: (response) => response ?? {},
    query: (data) => {
      const formData = makeFormData(data);

      return {
        method: 'POST',
        url: `/api/nut/files/upload`,
        body: formData,
        formData: true,
      };
    },
  }),
  getNutComments: builder.query({
    providesTags: ['NutComments'],
    query: ({ nutId }) => {
      return {
        method: 'GET',
        url: `/api/nut/comments`,
        params: {
          nid: nutId,
        },
      };
    },
  }),
  createNutComment: builder.mutation({
    invalidatesTags: ['NutComments'],
    query: ({ nutId, content }) => {
      return {
        method: 'POST',
        url: `/api/nut/comments`,
        body: {
          nutId,
          content,
        },
      };
    },
  }),
  updateNutComment: builder.mutation({
    invalidatesTags: ['NutComments'],
    query: ({ id, content }) => {
      return {
        method: 'PUT',
        url: `/api/nut/comments`,
        body: {
          id,
          content,
        },
      };
    },
  }),
  deleteNutComment: builder.mutation({
    invalidatesTags: ['NutComments'],
    query: ({ id }) => {
      return {
        method: 'DELETE',
        url: `/api/nut/comments`,
        body: {
          id,
        },
      };
    },
  }),
  replyNutComment: builder.mutation({
    invalidatesTags: ['NutComments'],
    query: ({ nutId, parentId, content }) => {
      return {
        method: 'POST',
        url: `/api/nut/comments/reply`,
        body: {
          nutId,
          parentId,
          content,
        },
      };
    },
  }),
  getNutEmails: builder.query({
    providesTags: ['NutEmails'],
    query: ({ nutId }) => {
      return {
        method: 'GET',
        url: `/api/nut/${nutId}/emails`,
      };
    },
  }),
  createNutEmail: builder.mutation({
    invalidatesTags: ['NutEmails'],
    query: ({ email, content, attachments, cc, to }) => {
      return {
        method: 'POST',
        url: `/api/nut/emails/reply`,
        body: {
          incomingEmail: {
            ...email,
            toEmails: to ?? [],
            ccEmails: cc ?? [],
            messageBodyHtml: sanitize(email?.messageBodyHtml ?? ''),
            replyMessageBodyHTML: sanitize(content || ''),
            attachmentFiles: attachments || [],
          },
        },
      };
    },
  }),
  createNutFirstEmail: builder.mutation({
    invalidatesTags: ['NutEmails'],
    query: ({
      workspaceEmailId,
      nutId,
      subject,
      sender,
      recipient,
      ccEmails,
      replyMessageBodyHTML,
      attachmentFiles,
    }) => {
      return {
        method: 'POST',
        url: `/api/nut/emails/new`,
        body: {
          incomingEmail: {
            workspaceEmailId,
            nutId,
            subject,
            sender,
            recipient,
            ccEmails,
            replyMessageBodyHTML: sanitize(replyMessageBodyHTML),
            attachmentFiles,
          },
        },
      };
    },
  }),
  getNutWorkspaceEmails: builder.query({
    providesTags: ['NutWorkspaceEmails'],
    query: ({ nutId }) => {
      return {
        method: 'GET',
        url: `/api/nut/${nutId}/shared-inbox-pipeline`,
      };
    },
  }),
});
