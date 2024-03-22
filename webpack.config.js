const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/app.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'static'),
        },
        compress: true,
        port: 9000,
    },
    output: {
        filename: 'bin.js',
        path: path.resolve(__dirname, 'out'),
    },
    plugins: [new HtmlWebpackPlugin({
        inject: "body",
        title: "Labyrinth Solver",
        template: "static/index.html"
    })],
};