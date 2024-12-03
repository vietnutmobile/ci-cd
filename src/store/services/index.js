import { baseQueryWithReAuth } from '@/helpers';
import { contactsApiEndpoints } from '@/store/services/contactsApi';
import { logsApiEndpoints } from '@/store/services/logsApi';
import { nutsApiEndpoints } from '@/store/services/nutsApi';
import { organizationApiEndpoints } from '@/store/services/organizationApi';
import { userApiEndpoints } from '@/store/services/userApi';
import { createApi } from '@reduxjs/toolkit/query/react';

export const rootApi = createApi({
  reducerPath: '$api',
  tagTypes: [
    'Contacts',
    'ContactByID',
    'Nuts',
    'HotNuts',
    'NutFiles',
    'NutComments',
    'NutEmails',
    'NutWorkspaceEmails',
    'Notes',
    'NutByID',
    'Logs',
    'Organization',
    'OrganizationEmailhub',
    'OrganizationEmailhubDetail',
    'OrganizationMembers',
    'OrganizationPipelineStages',
    'OrganizationPipelinesAndStages',
    'GlobalConfigs',
    'UserProfile',
    'UserProfileTokens',
    'UserCountUnreadNotifications',
    'ContactTags',
    'OrganizationNutsSummary',
  ],
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});

const contactApis = rootApi.injectEndpoints({
  endpoints: contactsApiEndpoints,
});
const logApis = rootApi.injectEndpoints({ endpoints: logsApiEndpoints });
const nutsApis = rootApi.injectEndpoints({ endpoints: nutsApiEndpoints });
const organizationApis = rootApi.injectEndpoints({
  endpoints: organizationApiEndpoints,
});
const userApis = rootApi.injectEndpoints({ endpoints: userApiEndpoints });

export const {
  useGetContactsQuery,
  useLazyGetContactsQuery,
  useGetAllContactTagsQuery,
  useGetContactByIdQuery,
  useLazyGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
  useBulkDeleteContactsMutation,
  useCreateContactTagMutation,
} = contactApis;

export const { useGetLogEventsQuery } = logApis;

export const {
  useGetHotNutsQuery,
  useGetNutsQuery,
  useGetNutByIdQuery,
  useImportNutsMutation,
  useCreateNutMutation,
  useUpdateNutMutation,
  useDeleteNutMutation,
  useBulkDeleteNutsMutation,
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useAttachFileToNutMutation,
  useDeleteNutFileMutation,
  useGetNutFilesQuery,
  useGetNutCommentsQuery,
  useCreateNutCommentMutation,
  useUpdateNutCommentMutation,
  useDeleteNutCommentMutation,
  useCreateNutCommentReplyMutation,
  useGetNutEmailsQuery,
  useCreateNutEmailMutation,
  useCreateNutFirstEmailMutation,
  useGetNutWorkspaceEmailsQuery,
} = nutsApis;

export const {
  useGetOrganizationMembersQuery,
  useGetOrganizationInfosQuery,
  useCreatePipelineMutation,
  useUpdatePipelineMutation,
  useGetPipelineStagesQuery,
  useLazyGetPipelineStagesQuery,
  useGetOrganizationPipelinesAndStagesQuery,
  useLazyGetOrganizationPipelinesAndStagesQuery,
  useDeleteOrganizationMutation,
  useGetEmailhubQuery,
  useConvertEmailhubToNutMutation,
  useReportNotSpamMutation,
  useGetEmailhubDetailQuery,
  useGetNutsSummaryQuery,
  useLazyGetNutsSummaryQuery,
} = organizationApis;

export const {
  useGetGlobalConfigsQuery,
  useGetUserProfileQuery,
  useChangeUserOnlineStatusMutation,
  useUpdateUserProfileMutation,
  useUpdateUserDeviceTokensMutation,
  useGetCountUnreadNotificationsQuery,
} = userApis;
