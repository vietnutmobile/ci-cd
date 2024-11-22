import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const getSvgXml = (currentColor, currentFill) => {
  return `
<svg stroke="${currentColor}" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="7 17 2 12 7 7"></polyline><polyline points="12 17 7 12 12 7"></polyline><path d="M22 18v-2a4 4 0 0 0-4-4H7"></path></svg>
  `;
};

const ReplyAllIcon = (props) => {
  const xml = getSvgXml(props.color, props.fill);
  return <SvgXml xml={xml} {...props} />;
};

export default ReplyAllIcon;
