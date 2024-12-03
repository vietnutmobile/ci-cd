// Define a service using a base URL and expected endpoints

import { Device } from '@/helpers';
import { PLATFORM_ANDROID, PLATFORM_IOS } from '@/helpers/constants';

export const userApiEndpoints = (builder) => ({
  getGlobalConfigs: builder.query({
    providesTags: ['GlobalConfigs'],
    query: () => {
      const platform = Device.isIOS() ? PLATFORM_IOS : PLATFORM_ANDROID;
      return {
        url: `/api/global-configs/platforms/${platform}`,
      };
    },
  }),
  getUserProfile: builder.query({
    providesTags: ['UserProfile'],
    query: () => ({
      url: '/api/users/profile',
    }),
  }),
  changeUserOnlineStatus: builder.mutation({
    invalidatesTags: ['UserProfile', 'OrganizationMembers'],
    query: ({ userId, isOnline }) => ({
      url: `/api/users/status`,
      method: 'POST',
      body: { userId, online: isOnline },
    }),
  }),
  updateUserProfile: builder.mutation({
    invalidatesTags: ['UserProfile'],
    query: ({ userId, orgId, name, title, avatar }) => {
      return {
        url: `/api/users/profile/update`,
        method: 'POST',
        body: {
          userId,
          orgId,
          name,
          title,
          avatar: {
            image: avatar,
          },
        },
      };
    },
  }),
  updateUserDeviceTokens: builder.mutation({
    invalidatesTags: ['UserProfileTokens'],
    query: ({ tokens }) => {
      return {
        url: `/api/users/device-tokens`,
        method: 'POST',
        body: {
          tokens,
        },
      };
    },
  }),
  getCountUnreadNotifications: builder.query({
    invalidatesTags: ['UserCountUnreadNotifications'],
    query: ({ userId }) => {
      return {
        url: `/api/users/${userId}/notifications/overview`,
        method: 'GET',
      };
    },
  }),
});

// export const { useGetUserProfileQuery } = userApi;
