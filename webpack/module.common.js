const ExtractTextPlugin = require('extract-text-webpack-plugin');
const sassLoader = require('./sassLoader');

const babelOptions = JSON.stringify({
    presets: ['react', 'env']
});
const babelLoader = `babel-loader?${babelOptions}`;

module.exports = {
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: [babelLoader]
        },
        {
            test: /favicon\.png/,
            loader: 'file-loader',
            query: {
                name: 'favicon.ico',
                publicPath: './'
            }
        },
        {
            test: filename => {
                if (filename.match(/favicon\.png/)) {
                    return false;
                }

                return filename.match(/\.(woff2?|ttf|eot|svg|png|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/);
            },
            loader: 'file-loader',
            query: {
                name: 'assets/[hash].[ext]',
                publicPath: '../'
            }
        },
        {
            test: /\.scss$/,
            enforce: 'pre',
            loaders: 'import-glob-loader'
        },
        {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: ExtractTextPlugin.extract(sassLoader)
        }
    ]
};

