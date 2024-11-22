import { useMemo } from 'react';
import { Box, Spinner } from 'native-base';

export const LoadingBox = ({ as, isLoading, children, ...props }) => {
  const Wrapper = useMemo(() => (as ? as : Box), [as]);

  return (
    <Wrapper {...props}>
      {children}
      {isLoading && <Spinner />}
    </Wrapper>
  );
};

export default LoadingBox;
