const path = require('path');

const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const autoprefixer = require('autoprefixer');

const baseConfig = require('./webpack.config')
const config = require("./index")

// 打包结果分析
if (config.pro.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    baseConfig.plugins.push(new BundleAnalyzerPlugin())
}

// 抽取css

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = merge(baseConfig, {
    mode:'production',
    output: {
        path: config.path.assetsRoot,
        filename: config.path.assetsPath('js/[name].[chunkhash:8].js'),
        chunkFilename: config.path.assetsPath('js/[name].[chunkhash:8].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'production'
        }),
        // extract css into its own file
        new MiniCssExtractPlugin({
            filename: config.path.assetsPath('css/[name].[contenthash:8].css'),
            // Setting the following option to `false` will not extract CSS from codesplit chunks.
            // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
            // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
            // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
            allChunks: true,
        }),
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.pro.productionSourceMap
                ? { safe: true, map: { inline: false } }
                : { safe: true }
        }),
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.pro.index,
            template: 'index.html',
            inject: true,
            minify: {
                collapseWhitespace: false,
                removeAttributeQuotes: false
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vendor modules does not change
        // new webpack.HashedModuleIdsPlugin(),
        // enable scope hoisting
        // new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    optimization: {
        moduleIds:'hashed',
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 5,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                default:false,
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                    name:'vendors'
                },
                headStyles: {
                    name: 'headStyles',
                    test: (m,c,entry = 'foo') => {
                        if (m.constructor.name !== 'CssModule'){
                            return;
                        }
                        // m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
                    },
                    chunks: 'all',
                    enforce: true
                },
                // default: {
                //   minChunks: 2,
                //     minSize: 0,
                //   priority: -20,
                //   reuseExistingChunk: true
                // }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    }
});