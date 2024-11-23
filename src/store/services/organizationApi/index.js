// Define a service using a base URL and expected endpoints

export const organizationApiEndpoints = (builder) => ({
  getOrganizationMembers: builder.query({
    providesTags: ['OrganizationMembers'],
    query: ({ orgId }) => ({
      url: `/api/organizations/${orgId}/members`,
    }),
  }),
  getOrganizationPipelinesAndStages: builder.query({
    providesTags: ['OrganizationPipelinesAndStages'],
    queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
      const orgId = _arg?.orgId ?? '';
      let pipelineId = _arg?.pipelineId ?? '';
      const skipNutCount = _arg?.skipNutCount ?? 0;

      const { data: orgData, error: pipelinesError } = await fetchWithBQ(
        `/api/organizations/${orgId}`,
      );

      const { pipeLines: pipelines } = orgData;

      if (pipelineId === '') {
        pipelineId = pipelines?.[0]?.id ?? '';
      }

      const { data: stages, error: stagesErrors } = await fetchWithBQ(
        `/api/pipelines/${pipelineId}/stages${skipNutCount ? '?skipNutCount=0' : ''}`,
      );

      if (!pipelinesError && !stagesErrors) {
        return {
          data: [pipelines, stages],
        };
      }

      return {
        error: pipelinesError ?? stagesErrors ?? 'Unknown error',
      };
    },
  }),
  getPipelineStages: builder.query({
    providesTags: ['OrganizationPipelineStages'],
    query: ({ pipelineId, ...params }) => {
      return {
        url: `/api/pipelines/${pipelineId}/stages`,
        params,
      };
    },
  }),
  getOrganizationInfos: builder.query({
    providesTags: ['Organization'],
    query: ({ orgId }) => ({
      url: `/api/organizations/${orgId}`,
    }),
  }),
  createPipeline: builder.mutation({
    invalidatesTags: ['Organization', 'OrganizationPipelineStages'],
    transformResponse: (response) => response ?? {},
    query: ({ orgId, pipeLineName, stages }) => ({
      method: 'POST',
      url: `/api/pipeLineNewSubmit`,
      body: {
        orgId,
        pipeLineName,
        stages,
      },
    }),
  }),
  updatePipeline: builder.mutation({
    invalidatesTags: ['Organization', 'OrganizationPipelineStages'],
    transformResponse: (response) => response ?? {},
    query: ({ pipelineId, pipeLineName, stages, deletedStageIds }) => ({
      method: 'POST',
      url: `/api/pipeLineEditSubmit`,
      body: {
        pipelineId,
        pipeLineName,
        stages,
        deletedStageIds,
      },
    }),
  }),
  deleteOrganization: builder.mutation({
    invalidatesTags: ['Organization'],
    query: ({ orgId }) => ({
      method: 'DELETE',
      url: `/api/organizations/${orgId}`,
    }),
  }),
  getEmailhub: builder.query({
    providesTags: ['OrganizationEmailhub'],
    query: ({ userId, ...params }) => {
      return {
        url: `/api/email-hub/${userId}/threads`,
        params,
      };
    },
  }),
  convertEmailhubToNut: builder.mutation({
    providesTags: ['OrganizationEmailhub'],
    invalidatesTags: ['OrganizationEmailhub'],
    query: ({ userId, threadId, ...params }) => {
      return {
        method: 'POST',
        url: `/api/email-hub/${userId}/threads/${threadId}/create-nut`,
        body: params,
      };
    },
  }),
  reportNotSpam: builder.mutation({
    providesTags: ['OrganizationEmailhub'],
    invalidatesTags: ['OrganizationEmailhub'],
    query: ({ userId, threadId }) => {
      return {
        method: 'POST',
        url: `/api/email-hub/${userId}/threads/${threadId}/report-not-spam`,
      };
    },
  }),
  getEmailhubDetail: builder.query({
    providesTags: ['OrganizationEmailhubDetail'],
    query: ({ userId, threadId }) => ({
      url: `/api/email-hub/${userId}/threads/${threadId}`,
    }),
  }),
});
