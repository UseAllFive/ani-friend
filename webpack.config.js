const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const commonConfig = {
    context: __dirname + '/src',
    entry: ['@babel/polyfill/noConflict', './index.js'],
    output: {
        path: __dirname + '/dist',
        filename: 'Ani.js',
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, './src/index.js')],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/src/images/**/*',
                to: __dirname + '/dist/',
            },
        ]),
        new HtmlWebpackPlugin({
            title: 'Ani Examples',
            template: __dirname + '/src/index.html',
            inject: 'body',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        esmodules: true,
                                        "ie": "11"
                                    },
                                },
                            ],
                        ],
                    },
                },
            },
        ],
    },
}

module.exports = [commonConfig]
