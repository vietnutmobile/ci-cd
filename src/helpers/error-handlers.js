export const findFirsErrorMessage = (obj) => {
  if (obj?.message) return obj.message;

  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      const foundMessage = findFirsErrorMessage(value);
      if (foundMessage) return foundMessage; // Return the found message
    }
  }
  return undefined;
};
