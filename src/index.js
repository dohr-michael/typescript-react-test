require( 'babel-polyfill' );
require( 'whatwg-fetch' );
var ReactDOM = require( 'react-dom' ),
    React = require( 'react' ),
    routes = require( './routes' ).default;


function startApp() {
    window.React = React;
    ReactDOM.render( routes, document.getElementById( 'app' ) );
}

if ( !global.Intl ) {
    // Webpack parses the inside of require.ensure at build time to know that intl
    // should be bundled separately. You could get the same effect by passing
    // ['intl'] as the first argument.
    require.ensure( [], function() {
        // Ensure only makes sure the module has been downloaded and parsed.
        // Now we actually need to run it to install the polyfill.
        require( 'intl' );
        require( 'intl/locale-data/jsonp/en.js' );
        startApp();
    }.bind( this ) );
} else {
    startApp();
}


