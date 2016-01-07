// This is a JS (NodeJS + browser) port of the Perl script from the
// Flathead News Network Inform 7 example:
//
//   http://inform7.com/learn/man/RB_12_5.html#e332
//
// For more information, see README.md.

(function() {
  var REQUEST_FILE = 'rssrequest';
  var REPLY_FILE = 'rssreply';
  var IN_BROWSER = typeof(window) !== 'undefined';
  var RSS_URL_PREFIX = IN_BROWSER ? 'http://crossorigin.me/http://'
                                  : 'http://';

  var glkfs = IN_BROWSER ? window.glkfs : require('./glkfs');
  var $ = IN_BROWSER ? window.jQuery : require('cheerio');
  var XMLHttpRequest = IN_BROWSER ? window.XMLHttpRequest
                                  : require('xmlhttprequest').XMLHttpRequest;

  if (!glkfs.exists(REPLY_FILE)) glkfs.write(REPLY_FILE, '');

  console.log("Waiting for changes to " + REQUEST_FILE + "...");

  // repeat forever:
  setInterval(function() {
    if (!glkfs.exists(REQUEST_FILE)) return;

    // the request file has been detected: 
    var lines = glkfs.read(REQUEST_FILE).split('\n');
    var header_line = lines[0]; // the header line
    var rss_feed = lines[1];  // the actual content - the RSS feed URL

    if (/^\*/.test(header_line)) { // if the request file is marked ready
      var req = new XMLHttpRequest();

      console.log("fetching " + rss_feed);
      req.open('GET', RSS_URL_PREFIX + rss_feed); // download the RSS feed
      req.onload = function() {
        // look for the title and description of the first item:
        var xml = IN_BROWSER ? req.responseXML
                             : $.load(req.responseText, {xmlMode: true}).root();
        var firstItem = $('item', xml)[0];
        var title = $('title', firstItem).text();
        var description = $('description', firstItem).text();

        // write the reply:
        console.log("writing '" + title + "'");
        glkfs.write(REPLY_FILE, "* //RSS-SCRIPT// rssreply\n" + title +
                                "\n" + description + "\n");
      };
      req.send(null);

      // request safely dealt with, so we can remove it:
      glkfs.remove(REQUEST_FILE);
    }
  }, 1000 /* wait 1 second */);
})();
