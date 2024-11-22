///   "id": 2,
//   "key": "android_features",
//   "value": "[\r\n  {\r\n    \"feature_id\": \"view_nut_emails\",\r\n    \"feature_name\": \"View Nut Emails\",\r\n    \"value\": false\r\n  },\r\n  {\r\n    \"feature_id\": \"view_nut_notes\",\r\n    \"feature_name\": \"View Nut Notes\",\r\n    \"value\": true\r\n  },\r\n  {\r\n    \"feature_id\": \"view_nut_comments\",\r\n    \"feature_name\": \"View Nut Comments\",\r\n    \"value\": false\r\n  },\r\n  {\r\n    \"feature_id\": \"view_nut_files\",\r\n    \"feature_name\": \"View Nut Files\",\r\n    \"value\": true\r\n  }\r\n]\r\n",
//   "valueType": "STRING",
//   "description": "Android features limitation for all organizations",
//   "platform": "ANDROID",
//   "createdAt": "2024-09-04T21:48:22.767Z",
//   "updatedAt": "2024-09-04T21:48:22.767Z",
//   "organizationId": null
// }

// valueType: BOOLEAN, STRING, NUMBER, JSON
export const parseGlobalConfigs = (configs) => {
  const valueType = configs?.valueType ?? 'STRING';
  let parsedValue = configs?.value ?? '';

  if (valueType === 'BOOLEAN') {
    parsedValue = parsedValue === 'true';
  } else if (valueType === 'NUMBER') {
    parsedValue = Number(parsedValue);
  } else if (valueType === 'JSON') {
    parsedValue = JSON.parse(parsedValue);
  }

  return {
    ...configs,
    parsedValue: parsedValue,
  };
};

export const getFeaturePermissionMap = (configs) => {
  if (!Array.isArray(configs?.parsedValue)) {
    return {};
  }

  const features = configs?.parsedValue ?? [];
  return features.reduce((acc, feature) => {
    acc[feature.feature_id] = feature.value;
    return acc;
  }, {});
};
