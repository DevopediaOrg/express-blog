const moment = require('moment');

module.exports = {

  date: function(str, fmt) {
    return moment(str).format(fmt);
  },
  
  now: function(format) {
    return Date().toLocaleString().replace(/ GMT.*/, '');
  },

  test: function(str) {
    return false; //eval(str);
  },

  urlslugify: function(str) {
    return '';
  },

  url: function(str) {
    return '';
  },

  title: function(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  },

  lower: function(str) {
    return str;
    return str.toLowerCase();
  },

  upper: function(str) {
    return str;
    return str.toUpperCase();
  },

  slugify: function(str) {
    return str;
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
    var to = 'aaaaaaeeeeiiiioooouuuunc------';
  
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
  
    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^-+/, '') // trim - from start of text
      .replace(/-+$/, ''); // trim - from end of text
  
    return str;
  },

  truncate: function(str, maxlen) {
    if (str.length > maxlen) return str.substring(0, maxlen-3) + '...';
    else return str;
  }
  
};