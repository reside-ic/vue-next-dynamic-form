const VueLoaderPlugin = require('vue-loader/lib/plugin');
const merge = require('webpack-merge');
const path = require('path');

const config = {
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};


module.exports = [
    merge(config, {
        entry: path.resolve(__dirname + '/src/plugin.js'),
        output: {
            filename: 'js/vue-dynamic-form.min.js',
            libraryTarget: 'window',
            library: 'vue-dynamic-form',
        }
    }),
    merge(config, {
        entry: path.resolve(__dirname + '/src/DynamicForm.vue'),
        output: {
            filename: 'js/vue-dynamic-form.js',
            libraryTarget: 'umd',
            library: 'vue-dynamic-form',
            umdNamedDefine: true
        }
    })
];
