/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import {
  createNotifications,
  SlideInLeftSlideOutRight,
} from 'react-native-notificated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const {NotificationsProvider} = createNotifications({
  duration: 3000,
  notificationPosition: 'top',
  animationConfig: SlideInLeftSlideOutRight,
  defaultStylesSettings: {
    darkMode: true,
  },
});

const Root = () => (
  <GestureHandlerRootView style={{flex: 1}}>
    <NotificationsProvider>
      <App />
    </NotificationsProvider>
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => Root);
