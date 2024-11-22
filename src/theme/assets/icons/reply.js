import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const getSvgXml = (currentColor, currentFill) => {
  return `
    <svg stroke="${currentColor}"  fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
  `;
};

const ReplyIcon = (props) => {
  const xml = getSvgXml(props.color, props.fill);
  return <SvgXml xml={xml} {...props} />;
};

export default ReplyIcon;
