const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: "GDPR",
            filename: 'GDPR.html',
            template: "./src/Pages/GDPR.html"
        }),
        new HtmlWebpackPlugin({
            title: "Impressum",
            filename: 'Impressum.html',
            template: "./src/Pages/Impressum.html"
        }),
        new HtmlWebpackPlugin({
            title: "Stop Watches",
            filename: 'index.html',
            template: "./src/Pages/index.html"
        }),
    ]
});