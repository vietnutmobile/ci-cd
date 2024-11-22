import { format, isToday, isYesterday } from 'date-fns';

export const formatEmailDate = (date) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM d');
};
