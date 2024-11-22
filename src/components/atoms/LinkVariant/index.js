import { Link as NBLink } from 'native-base';
import { testSelector } from '@/helpers/test-utils';

export const Link = ({ href, ...props }) => {
  const children = props.children;

  return (
    <NBLink href={href} {...testSelector(`link_${href}`)} {...props}>
      {children}
    </NBLink>
  );
};

export default Link;
