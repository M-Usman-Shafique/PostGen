import {useDarkModeContext} from '../hooks/useDarkModeContext';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import Home from './Home';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  const {isDark} = useDarkModeContext();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#000000' : '#D1D5DB',
        },
        headerTintColor: isDark ? '#877EFF' : '#1F2937',
        drawerStyle: {
          backgroundColor: isDark ? '#000000' : '#D1D5DB',
        },
        drawerLabelStyle: {
          color: isDark ? '#877EFF' : '#1F2937',
          fontSize: 22,
        },
        drawerActiveTintColor: isDark ? 'white' : 'black',
      }}>
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: () => (
            <Icon
              name="home"
              size={30}
              color={isDark ? '#877EFF' : '#1F2937'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
