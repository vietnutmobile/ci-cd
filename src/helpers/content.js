import {
  faFileArchive,
  faFileAudio,
  faFileCode,
  faFileCsv,
  faFileExcel,
  faFileImage,
  faFilePdf,
  faFilePowerpoint,
  faFileText,
  faFileVideo,
  faFileWord,
} from '@fortawesome/free-solid-svg-icons';
import Config from 'react-native-config';
import {buildNumber, version} from '../../package.json';

export const webAppOrigin = `${Config.WEBAPP_PROTOCOL}://${Config.WEBAPP_URL}`;

export const getUserNameFromEmail = emailAddress => {
  return emailAddress.split('@').shift();
};

export const extractContactDisplayName = contact => {
  const {firstName, lastName, fullName, email} = contact;

  if (fullName?.length > 0) {
    return fullName;
  }

  if (firstName?.length > 0 || lastName?.length > 0) {
    return `${firstName || ''} ${lastName || ''}`;
  }

  if (email?.length > 0) {
    return getUserNameFromEmail(email);
  }

  return 'Unnamed Contact';
};

export const mimeTypeToIcon = {
  // Media
  'image/': faFileImage,
  'audio/': faFileAudio,
  'video/': faFileVideo,
  // Documents
  'application/pdf': faFilePdf,
  'application/msword': faFileWord,
  'application/vnd.ms-word': faFileWord,
  'application/vnd.oasis.opendocument.text': faFileWord,
  'application/vnd.openxmlformats-officedocument.wordprocessingml': faFileWord,
  'application/vnd.ms-excel': faFileExcel,
  'application/vnd.openxmlformats-officedocument.spreadsheetml': faFileExcel,
  'application/vnd.oasis.opendocument.spreadsheet': faFileExcel,
  'application/vnd.ms-powerpoint': faFilePowerpoint,
  'application/vnd.openxmlformats-officedocument.presentationml':
    faFilePowerpoint,
  'application/vnd.oasis.opendocument.presentation': faFilePowerpoint,
  'text/plain': faFileText,
  'text/html': faFileCode,
  'application/json': faFileCode,
  'text/csv': faFileCsv,
  // Archives
  'application/gzip': faFileArchive,
  'application/zip': faFileArchive,

  // Default
  default: faFileCode,
};

export const getFileIcon = mimeType => {
  const iconKey = Object.keys(mimeTypeToIcon).find(key =>
    mimeType.startsWith(key),
  );
  return mimeTypeToIcon[iconKey] || null; // Fallback to null or a default icon
};

export const getWebAppOrigin = () => webAppOrigin;
