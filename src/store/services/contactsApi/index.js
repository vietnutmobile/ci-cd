import { makeFormData } from '@/helpers';

// Define a service using a base URL and expected endpoints
export const contactsApiEndpoints = (builder) => ({
  getContacts: builder.query({
    providesTags: ['Contacts'],
    query: (params) => {
      return {
        method: 'GET',
        url: `/api/contacts`,
        params: {
          ...params,
        },
      };
    },
    onError: (error, queryArg, context) => {
      console.error('Error fetching example:', error);
    },
  }),
  getContactById: builder.query({
    providesTags: ['ContactByID'],
    query: (params) => {
      const { id } = params;

      return {
        method: 'GET',
        url: `/api/contacts/${id}`,
        params: params,
      };
    },
  }),
  createContact: builder.mutation({
    invalidatesTags: ['Contacts'],
    transformResponse: (response) => response ?? {},
    query: (data) => {
      const formData = makeFormData(data);

      return {
        method: 'POST',
        url: `/api/contacts`,
        body: formData,
        formData: true,
      };
    },
  }),
  updateContact: builder.mutation({
    invalidatesTags: ['Contacts', 'ContactByID', 'Nuts', 'NutByID'],
    transformResponse: (response) => response ?? {},
    query: ({ id, data }) => {
      const formData = makeFormData(data);

      return {
        method: 'PUT',
        url: `/api/contacts/${id}`,
        body: formData,
        formData: true,
      };
    },
  }),
  deleteContact: builder.mutation({
    invalidatesTags: ['Contacts', 'ContactByID', 'Nuts', 'NutByID'],
    transformResponse: (response) => response ?? {},
    query: ({ id }) => {
      return {
        method: 'DELETE',
        url: `/api/contacts/${id}`,
      };
    },
  }),
  bulkDeleteContacts: builder.mutation({
    invalidatesTags: ['Contacts', 'ContactByID', 'Nuts', 'NutByID'],
    transformResponse: (response) => response ?? {},
    query: ({ ids }) => {
      return {
        method: 'POST',
        url: `/api/contacts/delete`,
        body: {
          ids,
        },
      };
    },
  }),
  createContactTag: builder.mutation({
    invalidatesTags: ['ContactTags', 'ContactTagsByContactId'],
    transformResponse: (response) => response ?? {},
    query: (data) => {
      return {
        method: 'POST',
        url: `/api/contacts/tags`,
        body: data,
      };
    },
  }),
  getContactsTagsByContactId: builder.query({
    providesTags: ['ContactTagsByContactId'],
    query: ({ contactId, ...params }) => {
      return {
        method: 'GET',
        url: `/api/contacts`,
        params: {
          contactId,
          ...params,
        },
      };
    },
  }),
  getAllContactTags: builder.query({
    providesTags: ['ContactTags'],
    query: (params = {}) => {
      const { slugs, search, ...rest } = params;

      return {
        method: 'GET',
        url: `/api/contacts/tags`,
        params: {
          slugs,
          search,
          ...rest,
        },
      };
    },
  }),
});
