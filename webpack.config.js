/* global __dirname, require, module*/

const path = require('path')
const env = require('yargs').argv.env // use --env with webpack 2
const pkg = require('./package.json')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let libraryName = pkg.name

let outputFile, mode, entry, plugins

if (env.production) {
    mode = 'production'
    outputFile = libraryName + '.min.js'
    entry = 'index.js'
    plugins = [
        new CleanWebpackPlugin(['lib']),
    ]
} else {
    mode = 'development'
    outputFile = libraryName + '.js'
    entry = 'test.js'
    plugins = [
        new CleanWebpackPlugin(['lib']),
        new HtmlWebpackPlugin({
            title: 'Test',
            template: __dirname + '/src/index.html',
            inject: 'body',
        }),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/images/',
                to: __dirname + '/lib/images/',
            },
        ]),
    ]
}

const config = {
    mode: mode,
    entry: __dirname + '/src/' + entry,
    devtool: 'inline-source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this",
    },
    target: 'node',
    externals: {
        gsap: {
            commonjs: 'gsap',
            commonjs2: 'gsap',
            amd: 'gsap',
            root: '_',
        },
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'lib'),
        compress: true,
        port: 9000,
    },
    plugins,
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.json', '.js'],
    },
}

module.exports = config
