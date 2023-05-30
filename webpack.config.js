const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');
const { merge } = require('webpack-merge');

const config = {
    mode: 'production',
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                'scss': 'vue-style-loader!css-loader!sass-loader',
                                'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                            }
                        }
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
    ]
};

const mainConfig = {
    externals: {
        vue: 'Vue'
    },
    entry: path.resolve(__dirname, 'src/index.ts'),
    output: {
        filename: 'js/index.js',
        library: {
            name: 'vueNextDynamicForm',
            type: 'umd'
        },
        umdNamedDefine: true
    }
};

const pluginConfig = {
    externals: {
        vue: 'Vue'
    },
    entry: path.resolve(__dirname, 'src/plugin.js'),
    output: {
        filename: 'js/vue-next-dynamic-form.min.js',
        library: {
            name: 'vueNextDynamicForm',
            type: 'window'
        }
    }
};

module.exports = [merge(config, mainConfig), merge(config, pluginConfig)];
