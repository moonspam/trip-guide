import $ from 'jquery';
import ProgressBar from 'progressbar.js';
import 'bootstrap';
import 'holderjs';
import '../css/style.scss';

const bar = new ProgressBar.Line('#loading-bar', {
  color: '#0FA0CE',
  svgStyle: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  easing: 'easeInOut',
});
bar.animate(1, { duration: 800 }, () => {
  bar.destroy();
});

$(document).ready(() => {
  $('[data-toggle="tooltip"]').tooltip();
});
