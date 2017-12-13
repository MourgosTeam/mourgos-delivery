import {colors} from './Styles.js';

let statusTexts = ['ΝΕΑ ΠΑΡΑΓΓΕΛΙΑ', 'ΕΤΟΙΜΑZETAI', 'ΕΤΟΙΜΑΣΤΗΚΕ','ΣΤΟ ΔΡΟΜΟ'];
statusTexts[99] = 'ΑΠΟΡΡΙΦΘΗΚΕ';
statusTexts[10] = 'ΠΑΡΑΔΟΘΗΚΕ';


let highlightColors = [colors.main, colors.secondary, colors.secondary, colors.green]; 
  	highlightColors[99] = colors.black;
  	highlightColors[10] = colors.black;

export default {
  EXTRA : 0.50,
  statusTexts,
  highlightColors
};