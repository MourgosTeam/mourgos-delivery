import React from 'react'; 
import {styles,colors} from './Styles';
import LoginScreen from './views/LoginScreen';
import ListOrdersScreen from './views/ListOrdersScreen';
import ListFreeOrdersScreen from './views/ListFreeOrdersScreen';
import OrderDetailsScreen from './views/OrderDetailsScreen';
import FreeOrderDetailsScreen from './views/FreeOrderDetailsScreen';
import MapScreen from './views/MapScreen';

import {View, Text, Platform, StatusBar} from 'react-native';
import Tabs from 'react-native-tabs';


import {StackNavigator, TabNavigator} from 'react-navigation';

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

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {page:'second'};
  }
  render() {
      return ( 
        <RootNavi styles={styles.mainContainer}/> 
      );
  }
}

export default App;