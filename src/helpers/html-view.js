import sanitizeHtml from 'sanitize-html';

const commentStyles = {
  baseText: {
    fontSize: 14,
    color: '#18181b',
  },
  mention: {
    display: 'flex',
    margin: 1.5,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 4,
    color: '#16a34a',
    backgroundColor: '#16a34a2a',
  },
  mentionCurrentUser: {
    color: '#ca8a04',
    backgroundColor: '#ca8a042a',
  },
  list: {
    marginTop: 8,
    marginBottom: 0,
    paddingLeft: 20,
  },
};

export const createHtmlViewBaseStyleSheet = () => ({
  h1: {
    fontSize: 24,
    lineHeight: 32,
    color: '#18181b',
  },
  h2: {
    fontSize: 22,
    lineHeight: 30,
    color: '#18181b',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    color: '#18181b',
  },
  h4: {
    fontSize: 18,
    lineHeight: 26,
    color: '#18181b',
  },
  h5: {
    fontSize: 16,
    lineHeight: 24,
    color: '#18181b',
  },
  h6: {
    fontSize: 14,
    lineHeight: 22,
    color: '#18181b',
  },
  blockquote: {
    borderLeftWidth: 3,
    borderStyle: 'solid',
    borderLeftColor: '#dfe2e5',
    padding: 14,
    paddingBottom: 0,
    marginTop: 6,
    marginBottom: 6,
    marginLeft: 4,
  },
  p: {
    ...commentStyles.baseText,
    margin: 0,
    lineHeight: 22,
  },
  div: {
    ...commentStyles.baseText,
    margin: 0,
    lineHeight: 22,
  },
  table: {
    ...commentStyles.baseText,
  },
  th: {
    ...commentStyles.baseText,
  },
  td: {
    ...commentStyles.baseText,
  },
  tr: {
    ...commentStyles.baseText,
  },
  span: {
    ...commentStyles.baseText,
    lineHeight: 22,
  },
  'mention-user': {
    ...commentStyles.baseText,
    ...commentStyles.mention,
  },
  'mention-current-user': {
    ...commentStyles.baseText,
    ...commentStyles.mentionCurrentUser,
  },
  ul: {
    ...commentStyles.baseText,
    ...commentStyles.list,
  },
  ol: {
    ...commentStyles.baseText,
    ...commentStyles.list,
  },
  li: {
    ...commentStyles.baseText,
    marginBottom: 6,
    marginLeft: 2,
  },
  'li p': {
    ...commentStyles.baseText,
    marginBottom: 0,
    marginLeft: 0,
  },
});

export const htmlToPlainText = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

export const preprocessHTML = (html, userId) => {
  const regex = /<span[^>]*data-mention-user-id="([^"]+)"[^>]*>(.*?)<\/span>/g;

  return html.replace(regex, (match, mentionId, innerText) => {
    const tagName = mentionId === userId ? 'mention-current-user' : 'mention-user';
    return `<${tagName} data-user-id="${mentionId}">${innerText}</${tagName}>`;
  });
};

export const cleanHTML = (htmlString, { shouldConvertLineBreak = true } = {}) => {
  let result = htmlString.replace(/<\/?(html|body|head|meta|font)[^>]*>/gi, '');

  if (shouldConvertLineBreak) {
    result = result.replace(/([\r\n])+/g, '<br>');
  } else {
    result = result.replace(/([\r\n])+/g, '');
  }

  return result;
};
