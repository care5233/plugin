const path = require('path');
const autoprefixer = require('autoprefixer');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV == 'development';

const config = require('./index')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

const baseConfig = {
    entry: './src/index.js',
    output: {
        path: config.path.assetsRoot,
        filename: '[name].js',
        publicPath: config.path.assetsPublicPath
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    devMode?'style-loader':MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options:{
                            plugins:[
                                autoprefixer("last 2 versions")
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.less/,
                use: [
                    devMode?'style-loader':MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options:{
                            plugins:[
                                autoprefixer("last 2 versions")
                            ]
                        }
                    },
                    'less-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
                exclude: resolve('node_modules')
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: config.path.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: config.path.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: config.path.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ],
    },
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    },
    plugins: [
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.path.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
};

module.exports = baseConfig;
// (env, argv) => {
//
//     // if (argv.mode === 'production') {
//     //     baseConfig.module.rules[0].use[0] = MiniCssExtractPlugin.loader;
//     //     baseConfig.module.rules[1].use[0] = MiniCssExtractPlugin.loader;
//     // }
//     console.log(baseConfig);
//     return baseConfig;
// };