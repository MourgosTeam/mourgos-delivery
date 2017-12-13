import React from 'react';
import {  KeyboardAvoidingView, View, Image, TextInput, Button, AsyncStorage } from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginForm from './LoginForm';

import API from '../helpers/net'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Σύνδεση',
  };

  constructor(props){
    super(props);
    this.navigation = this.props.navigation;
  }
  componentWillMount(){
    console.log("Component Login will mount!");
    this._mounted = true;
    this.check();
  }
  
  componentWillUnmount(){
    this._mounted = false;
  }

  check = () => {
    AsyncStorage.getItem("@Mourgos:token").then( (data) => {
      if(data !== null )
        API.checkSession(this.navigation).then( () => {
          if(this._mounted)
            API.resetNavi(this.navigation, "HomeStack")
        });
    });
  }
  loggedIn = (user) =>{
    if(!user.token)return;
    AsyncStorage.setItem("@Mourgos:token", user.token).
    then( () => {
     return API.checkSession(this.navigation)
    }).
    then( () => {
      if(this._mounted)
        API.resetNavi(this.navigation, "HomeStack")
    }).
    catch( (err) => { console.log("EROOR"); console.log(err); } );
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView 
        behavior = "padding"
        style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source = {require('../img/mourgos-logo-white.png')}
            style = {{height: 100, padding: 50}}
            resizeMode = 'contain'
          />
          <Text style = {styles.pageTitle}>Καλωσήρθατε!</Text>
        </View>
        <LoginForm onLogin={this.loggedIn}/>
        
      </KeyboardAvoidingView>
    );
  }
}
