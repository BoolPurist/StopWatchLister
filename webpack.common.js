const path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "main.js",
        publicPath: '/',
        path: path.resolve(__dirname, "docs")
    },
    module: {        
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: '[name].[contenthash].[ext]',
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
}
