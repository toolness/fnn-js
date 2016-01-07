// This is an abstraction layer for writing to .glkdata files as described
// in the Glk specification:
//
//   http://www.eblong.com/zarf/glk/glk-spec-074_6.html
//
// It can be used as a NodeJS module or in the browser.
//
// The browser implementation uses GlkOte's "virtual filesystem" stored in
// window.localStorage. It relies on dialog.js, which is part of GlkOte and
// is included in Quixe:
//
//   https://github.com/erkyrath/glkote/blob/master/dialog.js

var glkfs = (function() {
  var IN_BROWSER = typeof(window) !== 'undefined';
  var self = {};

  if (IN_BROWSER) {
    self.read = function(filename) {
      var ref = Dialog.file_construct_ref(filename, 'data', '');

      function arrayToString(arr) {
        return arr.map(function(ord) {
          return String.fromCharCode(ord);
        }).join('');
      }

      return arrayToString(Dialog.file_read(ref));
    };

    self.write = function(filename, str) {
      var ref = Dialog.file_construct_ref(filename, 'data', '');

      function stringToArray(str) {
        var arr = [];

        for (var i = 0; i < str.length; i++) {
          arr.push(str.charCodeAt(i));
        }

        return arr;
      }

      Dialog.file_write(ref, stringToArray(str));
    };

    self.remove = function(filename) {
      var ref = Dialog.file_construct_ref(filename, 'data', '');

      Dialog.file_remove_ref(ref);
    };

    self.exists = function(filename) {
      var ref = Dialog.file_construct_ref(filename, 'data', '');

      return Dialog.file_ref_exists(ref);
    };
  } else {
    var fs = require('fs');

    self.read = function(filename) {
      // TODO: Actually, .glkdata files are latin-1, I think, so it might
      // be nice to decode from that.
      return fs.readFileSync(filename + '.glkdata', 'ascii');
    };

    self.write = function(filename, str) {
      // TODO: Encode to latin-1?
      return fs.writeFileSync(filename + '.glkdata', str);
    };

    self.remove = function(filename) {
      fs.unlinkSync(filename + '.glkdata');
    };

    self.exists = function(filename) {
      return fs.existsSync(filename + '.glkdata');
    };

    module.exports = self;
  }

  return self;
})();
