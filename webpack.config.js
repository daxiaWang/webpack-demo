var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: { //入口
        app: './src/js/index.js',
        /*flexible:'flexible.js',
        zepto:'zepto.min.js'*/
        common: [
            './src/js/jquery-1.7.2.min.js',
            './src/js/template-web.js',
        ]
    },
    output: { //出口
        path: path.resolve(__dirname, 'build'),
        publicPath: '', //cdn
        filename: 'js/[name]._[hash].js'
    },
    devServer: { //服务
        contentBase: './build',
        //host:'localhost',
        //hot: true,
        open: true,
        inline: true,
        progress: true, //显示打包速度
        port: 8080,

    },
    module: {
        rules: [{ //css loader
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                        //在这里设置publicPath的路径就是background-img的路径 
                        options: {
                            publicPath: '../'
                        }
                    }, 'css-loader']
                })
            },
            {
                test: /\.less$/,
                use: [{
                        // loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            { //js loader
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // { // img 压缩，，生成hash值
            //     test: /\.(png|svg|jpg|gif)$/,
            //     use: "file-loader?name=[name][hash].[ext]&publicPath=./images/&outputPath=./images"
            //         /*name=[name].[ext]文件名，publicPath=../css中路径，outputPath=./img打包后的生成地址*/
            // },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: 'url-loader',
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        // limit: 10240,
                        publicPath: "./images", //打包后项目中的路径
                        outputPath: "./images", //打包后文件的路径
                        loaders: {
                            css: ExtractTextPlugin.extract({
                                fallback: 'style-loader',
                                use: 'css-loader',
                                publicPath: '../', //这行是重点啊，这样就会在css引入的图片里面加上该配置
                            })
                        }
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: './source/',
                        pulbicPath: './source/'
                    }
                }]
            },
            {
                test: /\.(htm|html)$/,
                loader: 'html-loader'
            }, {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },

            { //引用jquery
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: 'jQuery'
                }, {
                    loader: 'expose-loader',
                    options: '$'
                }]
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new htmlWebpackPlugin({ //有几个生成new几个html,生成html
            filename: 'index.html',
            titile: 'apphtml',
            template: 'index.html',
            chunks: ['app'], //html需要引入的js
            cache: true, //只有在内容变化时才会生成新的html
            minify: {
                removeComments: true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
        }),
        new cleanWebpackPlugin(['build']),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new uglifyjsWebpackPlugin(),
        new ExtractTextPlugin({ //提取css
            filename: 'css/[name]._[hash].css',
            disable: false,

            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({ //打包公共js
            //name:['flexible','zepto'],
            name: 'common',
            chunks: ['./src'],
            minChunks: 2,
            minChunks: Infinity
        }),
        new webpack.HashedModuleIdsPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8080' }) //自动打开浏览器
    ],
    externals: {
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        'video.js': 'videojs'
    }
};