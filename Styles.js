import { StyleSheet, StatusBar } from 'react-native';

export let colors = {
  main: '#EE6055',
  secondary: '#0D3B66',
  dark: '#3E3449',
  light: '#FBF5DD',
  white: '#FCFCFF',
  lightgray : '#FAFAFA',
  gray : '#CECECE',
  lightgreen: '#60EE55',
  black: '#000000',
  green : '#79c879',
  mapPosition: 'rgba(238,96,85,0.5)'
};

export let styles = StyleSheet.create({
  mainContainer: {
    padding : 0   
  },
  container: {
    backgroundColor: colors.main,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    alignItems: 'center',
  },

  pageTitle: {
    alignItems: 'center',
    fontSize: 40,
    color: colors.white,
  },

  loginForm: {
    width: '80%'
  },
  loginTextInput: {
    fontSize: 16,
    lineHeight: 16,
    paddingBottom: 4,
    paddingLeft: 4,
    color: colors.black
  },
  logoutButton: {
    marginRight: 6
  },
  textInput: {
    padding: 10,
    color: colors.dark
  },
  orderList: {
    width:'100%',
  },
  orderRow : {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection : 'row',
    padding: 5,
    margin: 5,
    justifyContent: 'space-between',
    borderWidth:  1,
    borderColor: colors.gray,
    alignItems: 'center',
    borderRadius: 2
  },
  orderRowLeft: { 
    flex  : 3,
    borderRightWidth: 2,
    paddingRight: 5
  },
  orderRowRight : {
    paddingLeft: 5,
    flex: 2,
    justifyContent: 'center',
    alignItems : 'center'
  },
  orderRowPrice : {
    textAlign: 'left' 
  },
  orderRowLeftText: {
    fontSize: 16
  },
  orderRowLeftDescription: {
    fontSize: 12
  },
  orderRowRightText: {
    fontSize: 12,
    textAlign: 'center' 
  },
  smallText: {
    fontSize : 12
  },
  bigText : {
    fontSize : 16
  },
  boldText : {
    fontWeight: 'bold'
  },
  rightText : {
    textAlign : 'right'
  },
  leftText : {
    textAlign : 'left'
  },
  centerText : {
    textAlign : 'center'
  },
  orderDetailsScroll : {
    alignItems : 'center',
    justifyContent: 'center',

  },
  orderDetailsContainer : {
    borderWidth : 1,
    borderColor : colors.lightgray,
    padding : 30,
    backgroundColor : colors.white,
    width: '100%',
    borderRadius: 2  
  },
  orderContainer: {
    backgroundColor: colors.main,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding : 30
  },
  orderDetailsHeader : {
    fontSize : 22,
    color : colors.white,
    paddingBottom: 10
  },
  orderDetailsAttributes : {
    fontSize : 14,
    color : colors.dark,
    paddingLeft: 5
  },
  orderDetailsProducts : {
    fontSize : 15,
    color : colors.dark
  },
  orderDetailsPanel : {
    paddingBottom: 10 
  },
  orderDetailsInner : {
    paddingBottom : 10,
    paddingTop : 10
  },
  orderDetailsQuantity : {
    paddingRight : 2
  },
});