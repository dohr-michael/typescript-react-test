var webpack = require( 'webpack' ),
    autoprefixer = require( 'autoprefixer' ),
    htmlWebpack = require( 'html-webpack-plugin' ),
    webpackNotifier = require( 'webpack-notifier' ),
    copyWebpack = require( 'copy-webpack-plugin' ),
    extractText = require( 'extract-text-webpack-plugin' ),
    pkg = require( './package.json' );

var target = process.env.npm_lifecycle_event ? process.env.npm_lifecycle_event : 'start';

var plugins = [];
var scss = [];
if ( target === 'start' ) {
    plugins.push(
        new webpackNotifier( { title: pkg.name } ),
        new webpack.HotModuleReplacementPlugin()/*,
         new webpack.optimize.CommonsChunkPlugin( { names: [ 'vendor', 'manifest' ] } )*/
    );
}
scss = [ 'style', 'css?localIdentName=[name]-[hash:base64:2]&modules', 'postcss', 'resolve-url', 'sass?sourceMap' ];


module.exports = {
    entry:      {
        app: './src'
    },
    output:     {
        path:     './dist',
        filename: '[name].js'
    },
    devtool:    'source-map',
    devServer:  {
        host:               'localhost',
        port:               8000,
        historyApiFallback: true,
        hot:                true,
        inline:             true,
        progress:           true,
        // Display only errors to reduce the amount of output.
        stats:              'errors-only',
        outputPath:         './server'
    },
    resolve:    {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [ '', '.webpack.js', '.web.js', '.ts', '.tsx', '.js' ],
        root: './src'
    },
    sassLoader: {
        includePaths: [
            './node_modules'
        ]
    },
    module:     {
        loaders:    [
            {
                test:    /\.tsx?$/,
                loaders: [ 'ts' ]
            },
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loaders: [ 'babel' ]
            },
            {
                test:   /\.(png|jpg|jpeg|gif|bmp)$/,
                loader: 'file?name=images/[hash].[ext]'
            },
            {
                test:   /\.(ttf|eot|otf|svg|woff(2)?)(\?[a-z0-9-\.=]+)?$/,
                loader: 'file?name=fonts/[hash].[ext]'
            },
            {
                test:    /\.s?css$/,
                loaders: scss
            }
        ],
        preLoaders: [
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loader:  'source-map-loader'
            }
        ]
    },
    plugins:    [
                    new htmlWebpack( {
                        appMountId: 'app',
                        mobile:     true,
                        template:   './src/index.html',
                        title:      pkg.name
                    } ),

                    new copyWebpack( [
                        { from: './node_modules/normalize.css', to: '' }
                    ] )
                ].concat( plugins ),
    postcss:    () => {
        return [ autoprefixer ];
    }
}