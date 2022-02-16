const path = require("path");
const outputPath = path.resolve(__dirname,"../public")

module.exports = {
    mode: "production",
    entry: "./react/src/index.js",
    output: {
        path: outputPath,
        filename: "index.js"
    },
    // devServer: {
    //     port: 3000
    // },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            "@babel/preset-react"
                        ],
                        plugins: [
                            ["@babel/plugin-transform-runtime"]
                        ]
                    }
                },
                exclude: [
                    /node_modules/,
                    /server.js/,
                    /rutas/,
                    /config/,
                    /público/
                ]
            }
        ]
    }
}