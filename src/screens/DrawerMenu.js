import {useDarkModeContext} from '../hooks/useDarkModeContext';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from './CustomDrawer';
import Home from '../components/Home';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Icony from 'react-native-vector-icons/Feather';
import {Pressable} from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerMenu() {
  const {isDark} = useDarkModeContext();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={({navigation}) => ({
        headerStyle: {
          backgroundColor: isDark ? '#000000' : '#D1D5DB',
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()}>
            <Icony
              name="menu"
              size={32}
              color={isDark ? '#877EFF' : '#1F2937'}
              style={{marginLeft: 16}}
            />
          </Pressable>
        ),
        headerTintColor: isDark ? '#877EFF' : '#1F2937',
        drawerStyle: {
          backgroundColor: isDark ? '#101012' : '#D1D5DB',
        },
        drawerLabelStyle: {
          color: isDark ? '#877EFF' : '#1F2937',
          fontSize: 24,
          marginLeft: -18,
        },
        drawerActiveTintColor: isDark ? 'white' : 'black',
      })}>
      <Drawer.Screen
        name="Create New Post"
        component={Home}
        options={{
          drawerIcon: () => (
            <Icon
              name="home"
              size={28}
              color={isDark ? '#877EFF' : '#1F2937'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
