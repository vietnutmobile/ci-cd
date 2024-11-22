import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
<svg
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="scale(2.777777777,2.777777777)">
      <path
        d="M36 31C36 33.762 33.762 36 31 36H5C2.239 36 0 33.762 0 31V5C0 2.238 2.239 0 5 0H31C33.762 0 36 2.238 36 5V31Z"
        fill="#3F51B5"
      />
      <path
        d="M28.368 19H25V32H20V19H17V15H20V12.59C20.002 9.082 21.459 7 25.592 7H29V11H26.713C25.104 11 25 11.6 25 12.723V15H29L28.368 19Z"
        fill="white"
      />
    </g>
  </svg>
`;

const FacebookIcon = (props) => (
  <SvgXml xml={xml} width="100%" height="100%" {...props} />
);

export default FacebookIcon;
