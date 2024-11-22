import { findFirsErrorMessage } from '@/helpers/error-handlers';
import { Toast as toast } from 'native-base/src';
import { Alert, Platform } from 'react-native';
import * as RNFS from 'react-native-fs';
import { launchImageLibrary } from 'react-native-image-picker';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import RNShare from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';
import DeviceInfo from 'react-native-device-info';

import { Device } from './device';

export const requestStoragePermission = async () => {
  let permission;

  if (Platform.OS === 'ios') {
    console.log('No permission needed for iOS');
    return true;
  } else {
    permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  }
  let deviceVersion = DeviceInfo.getSystemVersion();
  if (parseFloat(deviceVersion) >= 13) return true;

  const result = await request(permission);

  switch (result) {
    case RESULTS.UNAVAILABLE:
      console.log('This feature is not available (on this device / in this context)');
      return false;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      return false;
    case RESULTS.LIMITED:
      console.log('The permission is limited: some actions are possible');
      return true;
    case RESULTS.GRANTED:
      console.log('The permission is granted');
      return true;
    case RESULTS.BLOCKED:
      console.log('The permission is denied and not requestable anymore');
      return false;
  }
};

export const openFileSharing = async ({ filename, path }) => {
  const options = {
    title: 'Downloaded File',
    filename,
    url: Platform.OS === 'android' ? `file://${path}` : path,
    saveToFiles: true,
  };
  await RNShare.open(options);
};

export const downloadFile = async (file) => {
  const hasPermission = await requestStoragePermission();

  if (!hasPermission) {
    Alert.alert('Storage permission is not granted');
    console.log('Storage permission is not granted');
    return;
  }

  const { config, fs } = ReactNativeBlobUtil;
  let RootDir = Device.isAndroid() ? fs.dirs.DownloadDir : fs.dirs.DocumentDir;

  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir + '/' + file.name,
      description: 'Downloading file...',
      notification: true,
      useDownloadManager: true,
      appendExt: file.name.split('.').pop(),
    },
    path: RootDir + '/' + file.name,
    appendExt: file.name.split('.').pop(),
  };

  config(options)
    .fetch('GET', file.url)
    .then((res) => {
      if (Device.isAndroid()) toast.show({ description: 'File has been downloaded successfully' });
      else {
        console.log(res);
        Share.open({
          url: res.data,
          saveToFiles: true,
        })
          .then((resp) => {
            console.log('then share file --> ', resp);
            toast.show({ description: 'File has been downloaded successfully' });
          })
          .catch((err) => console.log('catch share file --> ', err));
      }
    })
    .catch((err) => {
      console.log('err download file', err);
    });

  // const localFilePath = `${RNFS.DocumentDirectoryPath}/${file?.name}`;
  // const url = file.url;
  // const headers = {};

  // if (file?.contentDisposition) {
  //   headers['Content-Disposition'] = file.contentDisposition;
  // }

  // try {
  //   await RNFS.downloadFile({
  //     fromUrl: url,
  //     toFile: localFilePath,
  //     headers,
  //   }).promise;

  //   Alert.alert('File downloaded!', 'File has been downloaded successfully', [
  //     {
  //       text: 'OK',
  //       onPress: () => {},
  //       style: 'cancel',
  //     },
  //   ]);
  // } catch (error) {
  //   toast.show({
  //     description: findFirsErrorMessage(error) || 'Unable to download file',
  //   });
  // }
};

export const pickImage = async () => {
  return new Promise((resolve) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          const image = response?.assets?.[0];
          const base64Uri = `data:${image.type};base64,${image.base64}`;
          resolve({ base64: base64Uri, name: image.fileName });
        }
      },
    );
  });
};
