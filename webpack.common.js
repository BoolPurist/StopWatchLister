const path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "main.js",
        publicPath: '/',
        path: path.resolve(__dirname, "dist")
    },
    module: {        
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                use: ["file-loader"]
            },
            {
                test: /\.s[ac]ss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    }
}
