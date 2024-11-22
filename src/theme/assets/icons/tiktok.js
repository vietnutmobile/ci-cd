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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.904 0H31.095C33.804 0 36 2.196 36 4.904V31.095C36 33.804 33.804 36 31.096 36H4.904C2.196 36 0 33.804 0 31.096V4.904C0 2.196 2.196 0 4.904 0Z"
        fill="#212121"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M23.208 14.607C24.784 15.733 26.715 16.395 28.8 16.395V12.384C28.405 12.384 28.012 12.343 27.626 12.261V15.418C25.541 15.418 23.611 14.755 22.034 13.63V21.814C22.034 25.908 18.713 29.227 14.617 29.227C13.089 29.227 11.668 28.765 10.488 27.973C11.835 29.349 13.713 30.203 15.791 30.203C19.887 30.203 23.208 26.884 23.208 22.79V14.607ZM24.657 10.561C23.852 9.68197 23.323 8.54497 23.208 7.28797V6.77197H22.095C22.375 8.36897 23.331 9.73397 24.657 10.561ZM13.079 24.832C12.629 24.242 12.386 23.521 12.387 22.779C12.387 20.906 13.906 19.388 15.78 19.388C16.129 19.388 16.476 19.441 16.809 19.547V15.447C16.42 15.394 16.028 15.371 15.635 15.379V18.57C15.302 18.464 14.955 18.411 14.605 18.411C12.731 18.411 11.212 19.929 11.212 21.802C11.213 23.127 11.972 24.274 13.079 24.832Z"
        fill="#EC407A"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.034 13.63C23.61 14.756 25.541 15.418 27.626 15.418V12.261C26.462 12.013 25.432 11.405 24.657 10.56C23.331 9.73297 22.376 8.36897 22.096 6.77197H19.173V22.79C19.166 24.657 17.65 26.169 15.78 26.169C14.678 26.169 13.699 25.644 13.079 24.831C11.972 24.273 11.213 23.126 11.213 21.802C11.213 19.929 12.732 18.411 14.606 18.411C14.965 18.411 15.311 18.467 15.636 18.57V15.38C11.612 15.463 8.37598 18.749 8.37598 22.791C8.37598 24.809 9.18198 26.638 10.49 27.974C11.67 28.766 13.091 29.228 14.619 29.228C18.715 29.228 22.036 25.909 22.036 21.815L22.034 13.63Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M27.6259 12.2619V11.4079C26.5759 11.4099 25.548 11.1159 24.657 10.5599C25.445 11.4229 26.4829 12.0179 27.6259 12.2619ZM22.095 6.77192C22.068 6.61892 22.048 6.46592 22.034 6.31092V5.79492H17.998V21.8139C17.992 23.6809 16.475 25.1929 14.605 25.1929C14.056 25.1929 13.538 25.0629 13.079 24.8309C13.699 25.6439 14.678 26.1689 15.78 26.1689C17.65 26.1689 19.166 24.6569 19.173 22.7899V6.77192H22.095ZM15.635 15.3799V14.4709C15.298 14.4249 14.958 14.4019 14.617 14.4019C10.52 14.4019 7.19995 17.7209 7.19995 21.8149C7.19995 24.3819 8.50495 26.6439 10.488 27.9739C9.17995 26.6379 8.37395 24.8089 8.37395 22.7909C8.37395 18.7489 11.611 15.4629 15.635 15.3799Z"
        fill="#81D4FA"
      />
    </g>
  </svg>
`;

const TiktokIcon = (props) => (
  <SvgXml xml={xml} width="100%" height="100%" {...props} />
);

export default TiktokIcon;
