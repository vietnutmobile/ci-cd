import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

Reactotron.configure({name: 'nutsales'})
  .use(reactotronRedux())
  .useReactNative({
    networking: true,
  })
  .connect();

console.log = Reactotron.log;

export default Reactotron;
