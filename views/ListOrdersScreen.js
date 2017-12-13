import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View, Image, TextInput, Button, ListView, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';
import Constants from '../Constants';
import API from '../helpers/net';


import OrderRow from './OrderRow.js';

const DEBUG = false;
function info(r){
  if(DEBUG)console.log(r);
}

const imageBaseURL = "http://mourgos.gr";

export default class ListOrdersScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let title = 'Παραγγελίες';
    let headerRight = (
      <View style={styles.logoutButton}>
      <Button
        title="Logout"
        onPress={params.logout ? params.logout : () => null}
      />
      </View>
    );
    return { title, headerRight };
  };
  componentWillUnmount(){this._mounted = false}
  componentWillMount(){this._mounted = true;
    API.checkSession(this.navigation);
  }

  componentDidMount(){
    this.navigation.setParams({ logout: this.logout });
  }

  constructor(props){
    super(props);
    // avoid update while unmounted... still bad practice better encapsulate to React.NoNeedToWorryAboutSetStateOnUnmountedComponent
    this._setState = this.setState;
    this.setState = (...args) => {
      if(this._mounted)
        this._setState(...args);
    }


    info("Constructing List");

    this.navigation = props.navigation;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource : this.ds.cloneWithRows([]),
      ImageUrl : require('../img/mourgos-logo-white.png')
    }
    
    this.loadOrders().
    catch( (err) => {
      info("Error loading orders...");
      info(err);
      API.checkSession(this.navigation);
    }); 
    this.socket = API.socket;
    // this.socket.on('connect', () => {
    //   this.setupSockets('all');
    // });
    this.setupSockets('all');
  }

  setupSockets = (id) => {
    info("Setup sockets!");
    this.socket.on('new-order', () => {
      info("New order!");
      this.loadOrders();
    });
    this.socket.on('update-order', () => {
      info("update order!");
      this.loadOrders();
    });
    this.socket.on('assign-order', () => {
      info("assign order!");
      this.loadOrders();
    });
  }

  logout = () => {
    info("Logging out...");
    return AsyncStorage.removeItem("@Mourgos:token").
    then(() => API.navigate(this.props.navigation,  "Login", "Login"));
  }

  loadOrders = ()=>{
    info("Loading orders");
    return API.getWithToken("orders/my").
    // then( (data) => {
    //   const forbidden = ['99','10'];
    //   let newdata = [];
    //   for (var i=0; i < data.length; i += 1) {
    //     if ( !forbidden.includes(data[i].Status) ) {
    //       newdata.push(data[i]);
    //     }
    //   }
    //   return newdata;
    // }).
    then( (data) => {
      this.setState({
        dataSource : this.ds.cloneWithRows(data)
      }); 
    });
  }
  
  goToOrder = (orderId) => {
    this.props.navigation.navigate("OrderDetails",{orderId : orderId});
  }

  render() {
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <ListView style={styles.orderList}
            enableEmptySections={true} 
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <OrderRow data={rowData} onPress={this.goToOrder}/>}
          />
      </KeyboardAvoidingView>
    );
  }
}
