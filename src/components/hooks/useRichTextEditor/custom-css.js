import { customFont } from '@/components/hooks/useRichTextEditor/custom-font';

export const customCSS = `
  ${customFont}
  * {
      font-family: 'Inter', Roboto, Arial, sans-serif;
  }
  body {
      font-size: 15px;
      line-height: 1.4em;
  }
  ul, ol {
      padding-left: 20px;
  }
`;
