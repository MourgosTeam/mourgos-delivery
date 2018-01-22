import React from 'react';
import { KeyboardAvoidingView, View, Image, TextInput, Button, Alert, Switch, AsyncStorage} from 'react-native';
import Text from '../helpers/Text'
import {styles, colors} from '../Styles';
import LoginFormInput from './LoginFormInput';
import API from '../helpers/net';

export default class LoginForm extends React.Component {
  componentDidMount(){
    this._mounted = true;
    AsyncStorage.getItem('@Mourgos:LoginData').then((data) => {
      return JSON.parse(data);
    }).then((data) => {
      console.log(data);
      if(this._mounted === true) {
        this.setState(data);
      }
    }).
    catch((err) => {
      console.log("No rememberMe Data");
    });
  }
  
  componentWillUnmount(){
    this._mounted = false;
  }
  constructor(props){
    super(props);


    this.state = {
      username : "",
      password : "",
      rememberMe : false
    }
    
  }

  toggleRemember = (value) => { 
    this.setState({
      rememberMe: value
    });
  }

  login = async () => {
    var user = {
      username : this.state.username,
      password : this.state.password
    };
    
    if (this.state.rememberMe) {
      try {
        let data = this.state;
        await AsyncStorage.setItem('@Mourgos:LoginData', JSON.stringify(data));
      } catch (error) {
        console.log("cannot set asyncStorage on rememberMe Login");
      }
    }
    else{
      try {
        await AsyncStorage.removeItem('@Mourgos:LoginData');
      } catch (error) {
        console.log("cannot set asyncStorage on rememberMe Login");
      } 
    }

    API.postIt("users/login",user).then((data) => {
      if(data.status !== 200){
        return Promise.reject("Bad credentials");
      }
      else{
        return data.json().then( (jsonData) => {
          if(jsonData.role !== 2){
            return Promise.reject("Not authorized");
          }
          return jsonData;
        });
      }
    }).
    then((data) => this.props.onLogin(data)).
    catch( (err) => {
      Alert.alert(
          'Αποτυχία Σύνδεσης',
          'Τα στοιχεία που έγραψες δεν είναι σωστά',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
    });
  }

  render() {
    return (
      <View
        style = {styles.loginForm}>
        <LoginFormInput
          name = 'Αναγνωριστικό διανομέα'
          onChange = { (val) => this.setState({username:val}) }
          value = {this.state.username}
          style={styles.loginTextInput}
        />
        <LoginFormInput
          name = 'Κωδικός πρόσβασης'
          secureTextEntry = {true}
          onChange = { (val) => this.setState({password:val}) }
          value = {this.state.password}
          style={styles.loginTextInput}
        />
        <View style={styles.logoutButton}>
          <Text>Θυμήσου τα στοιχεία μου</Text>
          <Switch onValueChange={this.toggleRemember} value={this.state.rememberMe}/>
        </View>
        <Button
          title = "Συνδεση"
          color = {colors.dark}
          onPress={this.login}
        />
      </View>
    );
  }
}
