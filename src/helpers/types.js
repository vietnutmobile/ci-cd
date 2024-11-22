export const isImageSourcePropType = (value) => {
  return !!(
    typeof value === 'number' ||
    (typeof value === 'object' &&
      value &&
      (('testUri' in value && typeof value.testUri === 'string') ||
        ('uri' in value && typeof value.uri === 'string')))
  );
};

export const hasProperty = (configuration, property) => {
  const parts = property.split('.');
  let currentObj = configuration;

  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i];
    if (!(part in currentObj)) {
      return false;
    }
    currentObj = currentObj[part];
  }
  return true;
};
