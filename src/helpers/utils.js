export const debounce = (func, timeout = 200) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const isNullOrUndefined = (value) => {
  return value === null || value === undefined;
};

export const capitalizeWords = (sentence) => {
  return sentence
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const removeQuotes = (str) => str.replace(/^["'](.+)["']$/, '$1').trim();
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getAvatarName = (name) => {
  return name
    .split(' ')
    .map((n) => n[0].toUpperCase())
    .join('')
    .slice(0, 2);
};
