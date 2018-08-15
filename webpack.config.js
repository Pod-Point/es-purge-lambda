const path = require('path');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: slsw.lib.entries,
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.ts',
            '.tsx'
        ]
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js'
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ],
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            'config.yml',
        ])
    ]
};
