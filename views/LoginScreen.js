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
    AsyncStorage.getItem("@Mourgos:token").then( (data) => {
      if(data !== null )
        API.checkSession(this.navigation.navigate).then( () => {
          if(this._mounted)
            API.resetNavi(this.navigation, "HomeStack")
        });
    });
    this._mounted = true;
  }
  
  componentWillUnmount(){
    this._mounted = false;
  }

  loggedIn = (user) =>{
    console.log(user);
    if(!user.token)return;
    AsyncStorage.setItem("@Mourgos:token", user.token).
    then( () => {
      console.log("HERE");
     return API.checkSession(this.navigation.navigate)
    }).
    then( () => API.resetNavi(this.navigation, "HomeStack")).
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
