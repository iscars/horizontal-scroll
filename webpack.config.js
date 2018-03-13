const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const src_dir = path.resolve(__dirname, 'src');
const dist_dir = path.resolve(__dirname, 'dist');

module.exports = {
    entry: src_dir + '/project.config.js',
    output: {
        path: dist_dir + '/assets',
        filename: 'bundle.js',
        publicPath: '/assets/'
    },
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.sass']
    },
    module: {
        rules: [
            {
                test: /\.js?/,
                include: src_dir,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-2']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/,
                include: src_dir,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {importLoaders: 1}
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                sourceMap: true,
                                plugins: [
                                    require('autoprefixer')({ browsers: ['last 3 versions', '> 1%'] })
                                ]
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            }
        ]
    },
    devServer: {
        contentBase: 'src/',
        host: '0.0.0.0',
        port: 9999,
        historyApiFallback: true
    },
    plugins: [
        new ExtractTextPlugin('app.css')
    ]
};