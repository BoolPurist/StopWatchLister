const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "bundle.[contenthash].js",
    },
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: "bundle.[contenthash].css"
            }
        ),
        new CleanWebpackPlugin(),
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
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 
                            ['@babel/preset-env', { targets: "defaults", modules: false } ] 
                        ],                
                    }
                }
            },
            {
                test: /\.s[ac]ss$/,
                use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader" ]
            }
        ]
    },
    optimization: {
        minimizer: [
          `...`,
          new CssMinimizerPlugin(),
        ],
      },
});