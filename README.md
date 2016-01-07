This is a port of the external script used by the [Inform 7][] example
[Flathead News Network][FNN] from Perl to JavaScript.

The external script can be run both in NodeJS (for development purposes
and desktop interpreters) as well as the browser. When run in the browser,
setting up an external server is not required, as the [crossorigin.me][]
web service is used to obtain RSS feeds.

To run the external script in NodeJS, run `npm install` followed by
`npm start`.

To play the example in the browser, visit `index.html` or
[toolness.github.io/fnn-js/](http://toolness.github.io/fnn-js/).

[Inform 7]: http://inform7.com/
[FNN]: http://inform7.com/learn/man/RB_12_5.html#e332
[crossorigin.me]: http://crossorigin.me/
