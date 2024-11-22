import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const getSvgXml = (currentColor, currentFill) => {
  return `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M15 17L20 12L15 7" stroke="${currentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M4 18L4 16C4 14.9391 4.42143 13.9217 5.17157 13.1716C5.92172 12.4214 6.93913 12 8 12L20 12" stroke="${currentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>
  `;
};

const ForwardIcon = (props) => {
  const xml = getSvgXml(props.color, props.fill);
  return <SvgXml xml={xml} {...props} />;
};

export default ForwardIcon;
