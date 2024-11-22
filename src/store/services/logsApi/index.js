// Define a service using a base URL and expected endpoints
export const logsApiEndpoints =  builder => ({
  getLogEvents: builder.query({
    query: ({ orgId, ...params }) => {
      return ({
        url: `/api/organizations/${orgId}/log-events`,
        params: params
      })
    },
  }),
})
