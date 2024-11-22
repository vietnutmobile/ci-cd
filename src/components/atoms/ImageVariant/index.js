import { Image as NBImage } from 'native-base';

function Image({ alt, ...props }) {
  // const source = useMemo(() => {
  //   const sourceVariant = `source${capitalize(variant)}`;
  //
  //   if (variant !== 'default' && props[sourceVariant]) {
  //     try {
  //       return props[sourceVariant];
  //     } catch (e) {
  //       return defaultSource;
  //     }
  //   }
  //   return defaultSource;
  // }, [variant]);

  return <NBImage alt={alt || ''} {...props} />;
}

export default Image;
