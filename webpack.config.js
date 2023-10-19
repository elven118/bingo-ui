const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
    },
    devServer: {
        contentBase: './dist',
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff(2)?|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ]
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    },
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Bingo',
            filename: 'index.html',
            template: 'src/index.html'
        }),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};