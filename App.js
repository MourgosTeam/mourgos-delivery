import React from 'react'; 
import {styles,colors} from './Styles';
import LoginScreen from './views/LoginScreen';
import ListOrdersScreen from './views/ListOrdersScreen';
import ListFreeOrdersScreen from './views/ListFreeOrdersScreen';
import OrderDetailsScreen from './views/OrderDetailsScreen';
import FreeOrderDetailsScreen from './views/FreeOrderDetailsScreen';
import MapScreen from './views/MapScreen';

import {Location} from 'expo';

import {View, Text, Platform, StatusBar} from 'react-native';
import Tabs from 'react-native-tabs';
import {StackNavigator, TabNavigator} from 'react-navigation';

import API from './helpers/net';

//////// NAVI STUFF //////////////////
const OrderNavi = StackNavigator({
  Orders: { screen: ListOrdersScreen  },
  OrderDetails: { screen: OrderDetailsScreen }  
},{
  headerMode : 'float'
});

const FreeOrderNavi = StackNavigator({
  Orders: { screen: ListFreeOrdersScreen  },
  OrderDetails: { screen: FreeOrderDetailsScreen }  
},{
  headerMode : 'float'
});

const HomeStack = TabNavigator({
  OrdersStack: { 
    screen: FreeOrderNavi,
    navigationOptions: {
      title: 'Ελεύθερες Παραγγελίες',
    }
  },
  MyOrders: { 
    screen: OrderNavi,
    navigationOptions: {
      title: 'Οι παραγγελίες μου',
    }
  },
  Map: { 
    screen: MapScreen,
    navigationOptions: {
      title: 'Χάρτης',
    }
  }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: colors.white,
    style: {
      backgroundColor: colors.secondary,
    }
  }
});
const RootNavi = StackNavigator({
  Login : {
    screen : LoginScreen
  },
  HomeStack : {
    screen : HomeStack
  }
}, {
  headerMode : 'none',
  cardStyle: {
    backgroundColor : '#000'
  }
});

//////////////////////////////////////////////
//////// END OF NAVI STUFF //////////////////
////////////////////////////////////////////
//////// TRACKING STUFF ///////////////////
//////////////////////////////////////////
const DEBUG = false;
const info = (m) => {
  if(DEBUG)console.log(m);
}

const saveLocation = (coords) => {
  info("Location to be saved!");
  info(coords);
  //check token first!
  API.postWithToken('log/mylocation', coords);
}

let Watcher = null;
const setupTracking = () => {
  Watcher = Location.watchPositionAsync({
    timeInterval: 10000,
    distanceInterval: 50
  }, saveLocation);
}

const disableTracking = () => {
  if(Watcher !== null)
    Watcher.remove();
}

////////////////////////////////////////////
//////// END OF TRACKING STUFF ///////////////////
//////////////////////////////////////////

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {page:'second'};
  }
  componentWillMount() { setupTracking() }
  componentWillUnmount() { disableTracking() }
  render() {
      return ( 
        <RootNavi styles={styles.mainContainer}/> 
      );
  }
}

export default App;