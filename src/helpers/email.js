import { EMAIL_REGEX } from '@/helpers/constants';
import { getUserNameFromEmail } from '@/helpers/content';
import { format } from 'date-fns';
import sanitizeHtml from 'sanitize-html';

export const sanitize = (html) => {
  return sanitizeHtml(html, {
    allowedTags: [
      'div',
      'span',
      'br',
      'p',
      'b',
      'i',
      'u',
      'strong',
      'img',
      'em',
      'hr',
      'a',
      'blockquote',
      'font',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'code',
    ],
    allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
    allowedAttributes: {
      div: ['class', 'id'],
      span: ['class'],
      p: ['class'],
      a: ['href', 'name', 'target'],
      img: ['src', 'alt'],
      font: ['face', 'color', 'size'],
      blockquote: ['class'],
      '*': ['class', 'id'],
    },
    disallowedAttributes: {
      div: ['style'],
      blockquote: ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'data'],
  });
};

export const processEmailSender = (sender) => {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
  const nameRegex = /^(.*?)(?=<)/;

  const emailMatch = emailRegex.exec(sender);
  const nameMatch = nameRegex.exec(sender);

  if (emailMatch) {
    const email = emailMatch[0];
    const name = nameMatch ? nameMatch[0].trim() : email.split('@')[0];
    return { name, email };
  } else {
    return { name: '', email: '' };
  }
};

export const addPreviousContentToReplyEmailBody = (emailBody, repliedEmail, preview = false) => {
  const { date, sender, messageBodyHtml, messageBodyHtmlRaw } = repliedEmail || {};
  const { name, email } = processEmailSender(sender ?? '');

  const replyContent = preview ? messageBodyHtml : messageBodyHtmlRaw ?? messageBodyHtml ?? '';

  const quotedMessage = `
    <div class="gmail_quote">
      <div class="gmail_attr" dir="ltr">
        On ${date}, ${name} &lt;<a href="mailto:${email}">${email}</a>&gt; wrote:<br>
      </div>
      <blockquote class="gmail_quote" style="margin: 0px 0px 0px 0.8ex; border-left: 1px solid rgb(204, 204, 204); padding-left: 1ex;">
        ${replyContent}
      </blockquote>
    </div>
  `;

  return `${emailBody}<div>${quotedMessage}</div>`;
};

export const extractValidEmails = (emailString) => {
  const emails = emailString.match(EMAIL_REGEX) || [];
  const trimmedEmails = emails.map((email) => email.trim());
  return [...new Set(trimmedEmails)];
};

function checkEmailValidation(emailAddress) {
  const trimmedEmail = (emailAddress || '').trim();
  const mailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return mailFormat.test(trimmedEmail);
}

const formatToLocalDateTime = (dateString) => {
  let date;
  try {
    date = new Date(dateString);
    return format(date, 'EEE, MMM d, h:mm a');
  } catch (error) {
    return '';
  }
};

export function splitEmailSender(emailSender = '') {
  if (checkEmailValidation(emailSender)) {
    return { name: getUserNameFromEmail(emailSender), email: emailSender };
  }

  const [namePart, emailPart] = emailSender.split('<');
  const name = namePart?.trim() || '';
  const email = emailPart?.replace('>', '').trim() || '';

  return { name, email };
}

const formatEmailLink = ({ name, email }) =>
  `${name} &lt;<a href="mailto:${email}">${email}</a>&gt;`;

export const formatForwardEmail = (content, email) => {
  const sender = splitEmailSender(email?.sender ?? '');

  const formattedRecipients =
    (email?.recipient ?? '')
      ?.split(',')
      .map((recipient) => formatEmailLink(splitEmailSender(recipient.trim())))
      .join(', ') ?? '';

  const formattedCcEmails =
    (email?.ccEmails ?? [])
      ?.map((ccEmail) => formatEmailLink(splitEmailSender(ccEmail.trim())))
      .join(', ') ?? '';

  return `
    ${content}
    <div>
      <p>---------- Forwarded message ---------</p>
      <p><strong>From:</strong> ${formatEmailLink(sender)}</p>
      <p><strong>Date:</strong> ${formatToLocalDateTime(email?.date ?? '')}</p>
      <p><strong>Subject:</strong> ${email?.subject}</p>
      <p><strong>To:</strong> ${formattedRecipients}</p>
      ${formattedCcEmails ? `<p><strong>Cc:</strong> ${formattedCcEmails}</p>` : ''}
      <hr />
      <div>${email?.messageBodyHtmlRaw ?? email?.messageBodyHtml ?? ''}</div>
    </div>
  `;
};
